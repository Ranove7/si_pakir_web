from services.database_service import SessionLocal
from models.user_model import UserModel
from fastapi import HTTPException
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ==========================
# GET ALL USERS
# ==========================
def get_all_users():
    session = SessionLocal()
    try:
        users = session.query(UserModel).all()
        return [
            {
                "id": u.id,
                "nama": u.nama,
                "username": u.username,
                "email": u.email,
                "id_card": u.id_card,
                "role": u.role,
            }
            for u in users
        ]
    finally:
        session.close()


# ==========================
# GET USER BY ID
# ==========================
def get_user_by_id(user_id: int):
    session = SessionLocal()
    try:
        user = session.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(404, "User tidak ditemukan")
        return {
            "id": user.id,
            "nama": user.nama,
            "username": user.username,
            "email": user.email,
            "id_card": user.id_card,
            "role": user.role,
        }
    finally:
        session.close()


# ==========================
# CREATE USER
# ==========================
def create_user(data):
    session = SessionLocal()
    try:
        # cek username duplikat
        existing_username = (
            session.query(UserModel)
            .filter(UserModel.username == data.username)
            .first()
        )
        if existing_username:
            raise HTTPException(400, "Username sudah digunakan")

        # cek email duplikat
        existing_email = (
            session.query(UserModel)
            .filter(UserModel.email == data.email)
            .first()
        )
        if existing_email:
            raise HTTPException(400, "Email sudah digunakan")

        user = UserModel(
            nama=data.nama,
            username=data.username,
            email=data.email,
            password=hash_password(data.password),
            id_card=data.id_card,
            role=data.role.value,
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return {
            "message": "User berhasil dibuat",
            "user": {
                "id": user.id,
                "nama": user.nama,
                "username": user.username,
                "email": user.email,
                "id_card": user.id_card,
                "role": user.role,
            },
        }
    finally:
        session.close()


# ==========================
# UPDATE USER
# ==========================
def update_user(user_id: int, data):
    session = SessionLocal()
    try:
        user = session.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(404, "User tidak ditemukan")

        # cek username duplikat (selain diri sendiri)
        existing_username = (
            session.query(UserModel)
            .filter(UserModel.username == data.username, UserModel.id != user_id)
            .first()
        )
        if existing_username:
            raise HTTPException(400, "Username sudah digunakan user lain")

        # cek email duplikat (selain diri sendiri)
        existing_email = (
            session.query(UserModel)
            .filter(UserModel.email == data.email, UserModel.id != user_id)
            .first()
        )
        if existing_email:
            raise HTTPException(400, "Email sudah digunakan user lain")

        user.nama = data.nama
        user.username = data.username
        user.email = data.email
        user.id_card = data.id_card
        user.role = data.role.value

        session.commit()

        return {"message": "User berhasil diperbarui"}
    finally:
        session.close()


# ==========================
# DELETE USER
# ==========================
def delete_user(user_id: int):
    session = SessionLocal()
    try:
        user = session.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(404, "User tidak ditemukan")

        session.delete(user)
        session.commit()

        return {"message": "User berhasil dihapus"}
    finally:
        session.close()