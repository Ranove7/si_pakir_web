from services.database_service import SessionLocal
from models.user_model import UserModel
from schemas.auth_schema import UserRegister, UserLogin
from fastapi import HTTPException, status
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


# ==========================
# PASSWORD
# ==========================
def hash_password(password):
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain, hashed):
    try:
        plain_bytes = plain.encode('utf-8')
        hashed_bytes = hashed.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False


# ==========================
# TOKEN
# ==========================
def create_token(user):
    expire = datetime.utcnow() + timedelta(days=1)

    payload = {
        "sub": user.username,
        "role": user.role,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ==========================
# REGISTER
# ==========================
def register_user(data: UserRegister):
    session = SessionLocal()

    cek = session.query(UserModel).filter(
        UserModel.username == data.username
    ).first()

    if cek:
        session.close()
        raise HTTPException(400, "Username sudah dipakai")

    user = UserModel(
        nama=data.nama,
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        id_card=data.id_card,
        role=data.role.value
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    session.close()

    return user


# ==========================
# LOGIN
# ==========================
def login_user(data: UserLogin):
    session = SessionLocal()

    user = session.query(UserModel).filter(
        UserModel.username == data.username
    ).first()

    session.close()

    if not user:
        raise HTTPException(401, "Username salah")

    if not verify_password(data.password, user.password):
        raise HTTPException(401, "Password salah")

    token = create_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nama": user.nama,
            "email": user.email,
            "username": user.username,
            "role": user.role
        }
    }

# =========== UPDATE PROFILE & CHANGE PASSWORD ===========

def update_profile(data):
    session = SessionLocal()

    user = session.query(UserModel).filter(UserModel.id == data.id).first()

    if not user:
        session.close()
        raise HTTPException(404, "User tidak ditemukan")

    user.nama = data.nama
    user.email = data.email

    session.commit()
    session.close()

    return {"message": "Profile berhasil diperbarui"}


def change_password(data):
    session = SessionLocal()

    user = session.query(UserModel).filter(UserModel.id == data.id).first()

    if not user:
        session.close()
        raise HTTPException(404, "User tidak ditemukan")

    user.password = hash_password(data.password)

    session.commit()
    session.close()

    return {"message": "Password berhasil diubah"}