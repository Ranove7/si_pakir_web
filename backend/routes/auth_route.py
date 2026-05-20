from fastapi import APIRouter
from models.user_model import UserLogin, UserRegister
from services.auth_service import login_user, register_user, update_profile, change_password  # tambah import
from pydantic import BaseModel, EmailStr

router = APIRouter()

class UpdateProfileData(BaseModel):
    id: int
    nama: str
    email: EmailStr

class ChangePasswordData(BaseModel):
    id: int
    password: str

@router.post("/login")
def login(data: UserLogin):
    return login_user(data)

@router.post("/register")
def register(data: UserRegister):
    return register_user(data)

@router.put("/update-profile")   # ← endpoint baru
def update_profile_route(data: UpdateProfileData):
    return update_profile(data)

@router.put("/update-password")  # ← endpoint baru
def update_password_route(data: ChangePasswordData):
    return change_password(data)