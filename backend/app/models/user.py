from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str

class UserResponse(BaseModel):
    email: EmailStr
    username: str
    id: str
    credits: float

class UserAddCredits(BaseModel):
    amount: float
    payment_method: str  # 'credit_card' or 'pix'

class GoogleLogin(BaseModel):
    token: str