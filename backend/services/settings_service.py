# ===============================================
# services/settings_service.py
# ===============================================
from fastapi import HTTPException
from services.database_service import SessionLocal
from models.user_model import UserModel
from services.auth_service import hash_password


# GET USER
def get_user_profile(user_id):
    session = SessionLocal()

    user = session.query(UserModel).filter(
        UserModel.id == user_id
    ).first()

    session.close()

    if not user:
        raise HTTPException(404, "User tidak ditemukan")

    return {
        "id": user.id,
        "nama": user.nama,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }


# UPDATE PROFILE
def update_user_profile(data):
    session = SessionLocal()

    user = session.query(UserModel).filter(
        UserModel.id == data.id
    ).first()

    if not user:
        session.close()
        raise HTTPException(404, "User tidak ditemukan")

    user.nama = data.nama
    user.email = data.email

    session.commit()
    session.close()

    return {"message": "Profile berhasil diperbarui"}


# CHANGE PASSWORD
def update_password(data):
    session = SessionLocal()

    user = session.query(UserModel).filter(
        UserModel.id == data.id
    ).first()

    if not user:
        session.close()
        raise HTTPException(404, "User tidak ditemukan")

    user.password = hash_password(data.password)

    session.commit()
    session.close()

    return {"message": "Password berhasil diubah"}