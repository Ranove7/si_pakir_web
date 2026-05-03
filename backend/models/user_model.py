from sqlalchemy import Column, Integer, String, Enum
from services.database_service import Base

# tambahan untuk schema FastAPI
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum as PyEnum


# ==================================================
# DATABASE MODEL
# ==================================================
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    id_card = Column(String(50), nullable=True)
    role = Column(Enum("admin", "petugas", "user"), default="user")


# ==================================================
# ENUM ROLE UNTUK REQUEST
# ==================================================
class RoleEnum(str, PyEnum):
    admin = "admin"
    petugas = "petugas"
    user = "user"


# ==================================================
# LOGIN REQUEST
# ==================================================
class UserLogin(BaseModel):
    username: str
    password: str


# ==================================================
# REGISTER REQUEST
# ==================================================
class UserRegister(BaseModel):
    nama: str
    username: str
    email: EmailStr
    password: str
    id_card: Optional[str] = None
    role: RoleEnum = RoleEnum.user


# ==================================================
# RESPONSE USER
# ==================================================
class UserResponse(BaseModel):
    id: int
    nama: str
    username: str
    email: str
    id_card: Optional[str]
    role: str

    class Config:
        from_attributes = True