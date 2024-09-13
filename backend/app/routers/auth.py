from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin, UserChangePassword
from utils.security import get_password_hash, verify_password, get_current_user, create_user_response
from database import get_db
from bson import ObjectId

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    db = get_db()
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "username": user.username,
        "password": hashed_password,
        "credits": user.initial_credits
    }
    result = db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return create_user_response(new_user)

@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return create_user_response(db_user)

@router.post("/change-password")
async def change_password(user_data: UserChangePassword, current_user: str = Depends(get_current_user)):
    db = get_db()
    db_user = db.users.find_one({"email": current_user})
    if not db_user or not verify_password(user_data.old_password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    new_hashed_password = get_password_hash(user_data.new_password)
    db.users.update_one({"email": current_user}, {"$set": {"password": new_hashed_password}})
    return {"message": "Password changed successfully"}