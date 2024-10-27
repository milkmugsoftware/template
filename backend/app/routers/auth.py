from urllib.parse import unquote_plus
import asyncio
from datetime import datetime
from bson import ObjectId
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse, RedirectResponse
from models.user import GoogleLogin, UserChangePassword, UserCreate, UserLogin, UserAcceptTerms
from utils.google_auth import get_google_auth_url, get_google_token, verify_google_token
from utils.security import create_user_response, get_current_user, get_password_hash, verify_password
from utils.email_utils import send_verification_email, create_verification_token, verify_email_token
from utils.facebook_auth import get_facebook_auth_url, get_facebook_token, get_facebook_user_info

router = APIRouter()

async def send_email_async(to_email: str, token: str):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, send_verification_email, to_email, token)

@router.post("/register")
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    db = get_db()
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "username": user.username,
        "password": hashed_password,
        "credits": 0,
        "email_verified": False,
        "created_at": datetime.utcnow(),
        "terms_accepted": False
    }
    result = db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id

    # Create and send verification email asynchronously
    verification_token = create_verification_token(user.email)
    background_tasks.add_task(send_email_async, user.email, verification_token)

    return create_user_response(new_user)

@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not db_user.get("email_verified", False):
        raise HTTPException(status_code=403, detail="Email not verified")
    return create_user_response(db_user)

@router.get("/verify-email")
async def verify_email(token: str):
    email = verify_email_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    db = get_db()
    result = db.users.update_one(
        {"email": email},
        {"$set": {"email_verified": True}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(email: str, background_tasks: BackgroundTasks):
    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.get("email_verified", False):
        raise HTTPException(status_code=400, detail="Email already verified")

    verification_token = create_verification_token(email)
    background_tasks.add_task(send_email_async, email, verification_token)

    return {"message": "Verification email resent"}

@router.get("/login/google")
async def login_google(request: Request):
    """Initiate Google Sign-In process"""
    redirect_uri = str(request.url_for('google_auth_callback'))
    return RedirectResponse(get_google_auth_url(redirect_uri))

@router.get("/login/google/callback")
async def google_auth_callback(request: Request):
    """Handle Google Sign-In callback"""
    try:
        # Get all query parameters
        params = dict(request.query_params)

        # Ensure required parameters are present
        if 'code' not in params:
            raise HTTPException(status_code=400, detail="Missing authorization code")

        # Decode the URL-encoded code
        code = unquote_plus(params['code'])

        redirect_uri = str(request.url_for('google_auth_callback'))

        token = get_google_token(code, redirect_uri)

        # Verify the token and get user info
        idinfo = verify_google_token(token)

        db = get_db()
        user = db.users.find_one({"email": idinfo["email"]})

        if not user:
            # Create a new user if they don't exist
            new_user = {
                "email": idinfo["email"],
                "username": idinfo.get("name", idinfo["email"].split("@")[0]),
                "google_id": idinfo["sub"],
                "credits": 0
            }
            result = db.users.insert_one(new_user)
            new_user["_id"] = result.inserted_id
            user = new_user
        elif "google_id" not in user:
            # Update existing user with Google ID if they haven't used Google login before
            db.users.update_one({"_id": user["_id"]}, {"$set": {"google_id": idinfo["sub"]}})

        return create_user_response(user)

    except Exception as e:
        # Log the error for debugging
        print(f"Error in google_auth_callback: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Google callback: {str(e)}")

@router.post("/change-password")
async def change_password(user_data: UserChangePassword, current_user: str = Depends(get_current_user)):
    db = get_db()
    db_user = db.users.find_one({"email": current_user})
    if not db_user or not verify_password(user_data.old_password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    new_hashed_password = get_password_hash(user_data.new_password)
    db.users.update_one({"email": current_user}, {"$set": {"password": new_hashed_password}})
    return {"message": "Password changed successfully"}

@router.get("/user")
async def get_user_info(current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": user["email"],
        "username": user["username"],
        "created_at": user["created_at"].isoformat(),
        "credits": user.get("credits", 0),
        "email_verified": user.get("email_verified", False),
        "terms_accepted": user.get("terms_accepted", False)
    }

@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token")
    return response

@router.get("/login/google")
async def login_google(request: Request):
    """Initiate Google Sign-In process"""
    redirect_uri = str(request.url_for('google_auth_callback'))
    return RedirectResponse(get_google_auth_url(redirect_uri))
@router.get("/login/google/callback")
async def google_auth_callback(request: Request):
    """Handle Google Sign-In callback"""
    try:
        # Get all query parameters
        params = dict(request.query_params)

        # Ensure required parameters are present
        if 'code' not in params:
            raise HTTPException(status_code=400, detail="Missing authorization code")

        # Decode the URL-encoded code
        code = unquote_plus(params['code'])

        redirect_uri = str(request.url_for('google_auth_callback'))

        token = get_google_token(code, redirect_uri)

        # Verify the token and get user info
        idinfo = verify_google_token(token)

        db = get_db()
        user = db.users.find_one({"email": idinfo["email"]})

        if not user:
            # Create a new user if they don't exist
            new_user = {
                "email": idinfo["email"],
                "username": idinfo.get("name", idinfo["email"].split("@")[0]),
                "google_id": idinfo["sub"],
                "credits": 0
            }
            result = db.users.insert_one(new_user)
            new_user["_id"] = result.inserted_id
            user = new_user
        elif "google_id" not in user:
            # Update existing user with Google ID if they haven't used Google login before
            db.users.update_one({"_id": user["_id"]}, {"$set": {"google_id": idinfo["sub"]}})

        return create_user_response(user)

    except Exception as e:
        # Log the error for debugging
        print(f"Error in google_auth_callback: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Google callback: {str(e)}")

@router.get("/login/facebook")
async def login_facebook(request: Request):
    """Initiate Facebook Sign-In process"""
    redirect_uri = str(request.url_for('facebook_auth_callback'))
    return RedirectResponse(get_facebook_auth_url(redirect_uri))

@router.get("/login/facebook/callback")
async def facebook_auth_callback(request: Request):
    """Handle Facebook Sign-In callback"""
    try:
        params = dict(request.query_params)
        if 'code' not in params:
            raise HTTPException(status_code=400, detail="Missing authorization code")

        redirect_uri = str(request.url_for('facebook_auth_callback'))
        access_token = get_facebook_token(params['code'], redirect_uri)
        user_info = get_facebook_user_info(access_token)

        db = get_db()
        user = db.users.find_one({"email": user_info["email"]})

        if not user:
            new_user = {
                "email": user_info["email"],
                "username": user_info.get("name", user_info["email"].split("@")[0]),
                "facebook_id": user_info["id"],
                "credits": 0,
                "email_verified": True,
                "created_at": datetime.utcnow(),
            }
            result = db.users.insert_one(new_user)
            new_user["_id"] = result.inserted_id
            user = new_user
        elif "facebook_id" not in user:
            db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"facebook_id": user_info["id"]}}
            )

        return create_user_response(user)

    except Exception as e:
        print(f"Error in facebook_auth_callback: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Facebook callback: {str(e)}")

