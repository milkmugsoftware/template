from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class CardInfo(BaseModel):
    card_number: str
    expiration_month: int
    expiration_year: int
    security_code: str
    cardholder_name: str

class PaymentCreate(BaseModel):
    amount: Decimal = Field(..., decimal_places=2)
    description: str
    installments: int = 1
    payment_method: str  # 'credit_card' or 'pix'

class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: float
    description: str
    payment_method: str

    class Config:
        json_encoders = {
            Decimal: float
        }

class PaginatedPaymentResponse(BaseModel):
    items: List[PaymentResponse]
    total: int
    page: int
    size: int
    pages: int

class PixPaymentCreate(BaseModel):
    amount: Decimal = Field(..., decimal_places=2)
    description: str

class PixPaymentResponse(BaseModel):
    qr_code: str
    qr_code_base64: str
    ticket_url: str