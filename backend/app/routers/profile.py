from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from models.user import UserProfile, UserResponse
from utils.security import get_current_user
from database import get_db
from bson.objectid import ObjectId

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: str = Depends(get_current_user)):
    db = get_db()
    user = db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_response = UserResponse(
        email=user["email"],
        username=user["username"],
        id=str(user["_id"]),
        credits=user.get("credits", 0),
        email_verified=user.get("email_verified", False),
        created_at=user.get("created_at", datetime.utcnow()),
        terms_accepted=user.get("terms_accepted", False),
        profile=user.get("profile", {})
    )
    return user_response

@router.put("/profile")
async def update_profile(profile: UserProfile, current_user: str = Depends(get_current_user)):
    db = get_db()
    result = db.users.update_one({"email": current_user}, {"$set": {"profile": profile.dict(exclude_unset=True)}})
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Profile update failed")
    return {"message": "Profile updated successfully"}

# Handling profile picture upload
@router.post("/profile/picture")
async def upload_profile_picture(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    db = get_db()
    # Save the file logic here (e.g., save to disk or cloud storage)
    # For demonstration, let's assume we save the file and get a URL:
    file_location = f"/static/profile_pictures/{current_user}.png"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    pfp_url = f"/static/profile_pictures/{current_user}.png"
    db.users.update_one({"email": current_user}, {"$set": {"profile.pfp_url": pfp_url}})
    return {"message": "Profile picture uploaded successfully", "pfp_url": pfp_url}
