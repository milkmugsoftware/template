import re
from datetime import datetime
from math import ceil
from typing import Optional

import mercadopago
from bson import ObjectId
from config import MERCADO_PAGO_ACCESS_TOKEN, CREDIT_VALUE
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from models.payment import CardInfo, PaginatedPaymentResponse, PaymentCreate, PaymentResponse, PixPaymentCreate, PixPaymentResponse
from models.user import UserAddCredits
from utils.security import get_current_user

router = APIRouter()
sdk = mercadopago.SDK(MERCADO_PAGO_ACCESS_TOKEN)

def get_payment_method_id(card_number: str):
    payment_methods = sdk.payment_methods().list_all()

    for method in payment_methods["response"]:
        if method["payment_type_id"] == "credit_card":
            for setting in method["settings"]:
                if "bin" in setting:
                    pattern = setting["bin"].get("pattern")
                    exclusion_pattern = setting["bin"].get("exclusion_pattern")

                    if pattern and re.match(pattern, card_number):
                        if exclusion_pattern and re.match(exclusion_pattern, card_number):
                            continue
                        return method["id"]

    raise HTTPException(status_code=400, detail="Unable to determine payment method")

@router.post("/create_payment", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreate, card: Optional[CardInfo] = None, current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    payment_data = {
        "transaction_amount": float(payment.amount),
        "description": payment.description,
        "payment_method_id": payment.payment_method,
        "payer": {
            "email": user["email"]
        }
    }

    if payment.payment_method == "credit_card":
        if not card:
            raise HTTPException(status_code=400, detail="Card info is required for credit card payments")

        # Create card token
        card_data = {
            "card_number": card.card_number,
            "expiration_month": card.expiration_month,
            "expiration_year": card.expiration_year,
            "security_code": card.security_code,
            "cardholder": {
                "name": card.cardholder_name
            }
        }

        card_token_result = sdk.card_token().create(card_data)

        if card_token_result["status"] != 201:
            raise HTTPException(status_code=400, detail="Failed to create card token")

        card_token = card_token_result["response"]["id"]
        payment_data["token"] = card_token
        payment_data["installments"] = payment.installments
        payment_data["payment_method_id"] = get_payment_method_id(card.card_number)

    elif payment.payment_method == "pix":
        payment_data["payment_method_id"] = "pix"
    else:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    payment_response = sdk.payment().create(payment_data)

    if payment_response["status"] == 201:
        payment_result = payment_response["response"]
        db.payments.insert_one({
            "user_id": user["_id"],
            "payment_id": payment_result["id"],
            "status": payment_result["status"],
            "amount": float(payment.amount),
            "description": payment.description,
            "payment_method": payment.payment_method,
            "payment_date": datetime.utcnow(),
            "credits_added": False
        })

        if payment.payment_method == "credit_card" and payment_result["status"] == "approved":
            # Add credits to user's account immediately for approved credit card payments
            credits_to_add = float(payment.amount) / CREDIT_VALUE
            db.users.update_one(
                {"_id": user["_id"]},
                {"$inc": {"credits": credits_to_add}}
            )
            db.payments.update_one(
                {"payment_id": payment_result["id"]},
                {"$set": {"credits_added": True}}
            )

        return PaymentResponse(
            id=str(payment_result["id"]),
            status=payment_result["status"],
            amount=float(payment.amount),
            description=payment.description,
            payment_method=payment.payment_method
        )
    else:
        raise HTTPException(status_code=400, detail="Payment creation failed")

@router.post("/create_pix_payment", response_model=PixPaymentResponse)
async def create_pix_payment(payment: PixPaymentCreate, current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    payment_data = {
        "transaction_amount": float(payment.amount),
        "description": payment.description,
        "payment_method_id": "pix",
        "payer": {
            "email": user["email"]
        }
    }

    payment_response = sdk.payment().create(payment_data)

    if payment_response["status"] == 201:
        payment_result = payment_response["response"]
        db.payments.insert_one({
            "user_id": user["_id"],
            "payment_id": str(payment_result["id"]),
            "status": payment_result["status"],
            "amount": float(payment.amount),
            "description": payment.description,
            "payment_method": "pix",
            "payment_date": datetime.utcnow(),
            "credits_added": False
        })

        return PixPaymentResponse(
            qr_code=payment_result["point_of_interaction"]["transaction_data"]["qr_code"],
            qr_code_base64=payment_result["point_of_interaction"]["transaction_data"]["qr_code_base64"],
            ticket_url=payment_result["point_of_interaction"]["transaction_data"]["ticket_url"]
        )
    else:
        raise HTTPException(status_code=400, detail="Pix payment creation failed")

@router.post("/webhook")
async def payment_webhook(data: dict):
    if data["type"] == "payment":
        payment_id = data["data"]["id"]
        payment_info = sdk.payment().get(payment_id)

        if payment_info["status"] == 200:
            payment = payment_info["response"]
            db = get_db()
            db_payment = db.payments.find_one({"payment_id": payment_id})

            if db_payment and not db_payment["credits_added"] and payment["status"] == "approved":
                print("in")
                user = db.users.find_one({"_id": db_payment["user_id"]})
                if user:
                    credits_to_add = float(payment["transaction_amount"]) / CREDIT_VALUE
                    db.users.update_one(
                        {"_id": user["_id"]},
                        {"$inc": {"credits": credits_to_add}}
                    )
                    db.payments.update_one(
                        {"payment_id": payment_id},
                        {"$set": {"credits_added": True, "status": "approved"}}
                    )

    return {"status": "success"}

@router.get("/payments", response_model=PaginatedPaymentResponse)
async def get_payments(
    current_user: str = Depends(get_current_user),
    payment_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100)
):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare the filter
    filter_query = {"user_id": ObjectId(user["_id"])}
    if payment_id:
        filter_query["payment_id"] = payment_id

    # Get total count
    total = db.payments.count_documents(filter_query)

    # Calculate pagination
    total_pages = ceil(total / size)
    skip = (page - 1) * size

    # Fetch payments
    payments = db.payments.find(filter_query).skip(skip).limit(size)

    # Prepare response
    items = [
        PaymentResponse(
            id=str(payment["payment_id"]),
            status=payment["status"],
            amount=payment["amount"],
            description=payment["description"],
            payment_method=payment["payment_method"]
        ) for payment in payments
    ]

    return PaginatedPaymentResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=total_pages
    )

@router.get("/user_credits")
async def get_user_credits(current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"credits": user.get("credits", 0)}

# @router.post("/add_credits")
# async def add_credits(credits_data: UserAddCredits, current_user: str = Depends(get_current_user)):
#     db = get_db()
#     user = db.users.find_one({"email": current_user})

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     payment_amount = credits_data.amount * CREDIT_VALUE

#     if credits_data.payment_method == "credit_card":
#         # Implement credit card payment logic
#         # This should create a payment and immediately add credits if approved
#         pass
#     elif credits_data.payment_method == "pix":
#         # Implement Pix payment logic
#         # This should create a Pix payment, but not add credits until confirmed via webhook
#         pass
#     else:
#         raise HTTPException(status_code=400, detail="Invalid payment method")

#     return {"message": f"Payment of {payment_amount} created for {credits_data.amount} credits"}