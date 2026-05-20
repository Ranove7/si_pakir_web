from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class RoleEnum(str, Enum):
    admin = "admin"
    petugas = "petugas"
    user = "user"


class UserRegister(BaseModel):
    nama: str
    username: str
    email: EmailStr
    password: str
    id_card: Optional[str] = None
    role: RoleEnum = RoleEnum.user


class UserLogin(BaseModel):
    username: str
    password: str