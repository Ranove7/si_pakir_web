from services.database_service import SessionLocal
from models.user_model import UserModel
from schemas.auth_schema import UserRegister, UserLogin
from fastapi import HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# JWT
SECRET_KEY = "secretkey123456789"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ==========================
# PASSWORD
# ==========================
def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


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