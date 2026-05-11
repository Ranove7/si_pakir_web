from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from services.user_service import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
)
from models.user_model import RoleEnum

router = APIRouter()


# ==========================
# SCHEMAS
# ==========================
class CreateUserData(BaseModel):
    nama: str
    username: str
    email: EmailStr
    password: str
    id_card: Optional[str] = None
    role: RoleEnum = RoleEnum.user


class UpdateUserData(BaseModel):
    nama: str
    username: str
    email: EmailStr
    id_card: Optional[str] = None
    role: RoleEnum


# ==========================
# GET ALL USERS
# Admin & Petugas bisa akses
# ==========================
@router.get("/")
def list_users():
    return get_all_users()


# ==========================
# GET USER BY ID
# ==========================
@router.get("/{user_id}")
def detail_user(user_id: int):
    return get_user_by_id(user_id)


# ==========================
# CREATE USER
# Hanya admin
# ==========================
@router.post("/")
def tambah_user(data: CreateUserData):
    return create_user(data)


# ==========================
# UPDATE USER
# Hanya admin
# ==========================
@router.put("/{user_id}")
def ubah_user(user_id: int, data: UpdateUserData):
    return update_user(user_id, data)


# ==========================
# DELETE USER
# Hanya admin
# ==========================
@router.delete("/{user_id}")
def hapus_user(user_id: int):
    return delete_user(user_id)