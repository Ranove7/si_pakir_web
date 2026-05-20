from fastapi import APIRouter, HTTPException
from models.user_model import (
    UserRegister,
    UserResponse
)

from services.user_service import (
    get_all_users,
    create_user,
    update_user,
    get_user_by_id,
    get_rfid_card
)

router = APIRouter()


# =========================================
# GET ALL USERS
# =========================================
@router.get("/", response_model=list[UserResponse])
def read_users():
    return get_all_users()


# =========================================
# CREATE USER
# =========================================
@router.post("/")
def store_user(data: UserRegister):

    user = create_user(data)

    return {
        "message": "User berhasil dibuat",
        "user_id": user.id
    }


# =========================================
# GET USER BY ID
# =========================================
@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int):

    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    return user


# =========================================
# UPDATE USER
# =========================================
@router.put("/{user_id}")
def edit_user(user_id: int, data: UserRegister):

    updated = update_user(user_id, data)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    return {
        "message": "User berhasil diupdate"
    }


# =========================================
# RFID SCAN
# =========================================
@router.get("/scan-rfid")
def scan_rfid():

    card_id = get_rfid_card()

    return {
        "id_card": card_id
    }