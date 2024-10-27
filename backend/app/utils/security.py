from datetime import datetime, timedelta
import jwt
from config import JWT_ALGORITHM, JWT_SECRET
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.user import UserResponse
from passlib.context import CryptContext
from database import get_db
from bson import ObjectId
import uuid
from fastapi.responses import Response

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_session_tokens(user_id: str, email: str) -> tuple[str, str]:
    # Generate a unique invalidate ID
    invalidate_id = str(uuid.uuid4())
    db = get_db()

    # Create access token that expires in 1 hour
    access_expires = datetime.utcnow() + timedelta(hours=1)
    access_token = jwt.encode(
        {
            "user_id": str(user_id),
            "sub": email,
            "exp": access_expires,
            "type": "access",
            "invalidate_id": invalidate_id
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    # Create refresh token that expires in 30 days
    refresh_expires = datetime.utcnow() + timedelta(days=30)
    refresh_token = jwt.encode(
        {
            "user_id": str(user_id),
            "exp": refresh_expires,
            "type": "refresh",
            "invalidate_id": invalidate_id
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    # Store session in database
    db.sessions.insert_one({
        "invalidate_id": invalidate_id,
        "user_id": ObjectId(user_id),
        "created_at": datetime.utcnow(),
        "expires_at": refresh_expires,
        "last_used": datetime.utcnow()
    })

    return access_token, refresh_token


def verify_token(token: str, token_type: str = "access"):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        # Verify token type
        if payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail="Invalid token type")

        # Verify session exists
        db = get_db()
        session = db.sessions.find_one({"invalidate_id": payload.get("invalidate_id")})
        if not session:
            raise HTTPException(status_code=401, detail="Invalid session")

        # Update last_used timestamp for the session
        db.sessions.update_one(
            {"invalidate_id": payload.get("invalidate_id")},
            {"$set": {"last_used": datetime.utcnow()}}
        )

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def invalidate_session(invalidate_id: str):
    db = get_db()
    db.sessions.delete_one({"invalidate_id": invalidate_id})


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,  # Enable in production with HTTPS
        samesite="lax",
        max_age=3600  # 1 hour
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # Enable in production with HTTPS
        samesite="lax",
        max_age=2592000  # 30 days
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")


async def get_current_user(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = verify_token(access_token, "access")
    return payload.get("sub")


def create_user_response(user: dict) -> dict:
    user_response = UserResponse(
        email=user["email"],
        username=user["username"],
        id=str(user["_id"]),
        credits=user.get("credits", 0),
        email_verified=user.get("email_verified", False),
        created_at=user.get("created_at", datetime.utcnow()),
        terms_accepted=user.get("terms_accepted", False),
    )

    # Create both access and refresh tokens
    access_token, refresh_token = create_session_tokens(str(user["_id"]), user["email"])

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "data": user_response.dict(),
    }
