from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from services.settings_service import (
    get_user_profile,
    update_user_profile,
    update_password
)

router = APIRouter(prefix="/settings")


class UpdateProfile(BaseModel):
    id: int
    nama: str
    email: EmailStr


class ChangePassword(BaseModel):
    id: int
    password: str


@router.get("/user/{user_id}")
def get_user(user_id: int):
    return get_user_profile(user_id)


@router.put("/profile")
def update_profile(data: UpdateProfile):
    return update_user_profile(data)


@router.put("/password")
def change_password(data: ChangePassword):
    return update_password(data)