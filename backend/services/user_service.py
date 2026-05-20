from services.database_service import SessionLocal
from models.user_model import UserModel
from passlib.hash import bcrypt
import requests


# =========================================
# GET ALL USERS
# =========================================
def get_all_users():

    session = SessionLocal()

    users = session.query(UserModel).all()

    session.close()

    return users


# =========================================
# GET USER BY ID
# =========================================
def get_user_by_id(user_id: int):

    session = SessionLocal()

    user = (
        session.query(UserModel)
        .filter(UserModel.id == user_id)
        .first()
    )

    session.close()

    return user


# =========================================
# CREATE USER
# =========================================
def create_user(data):

    session = SessionLocal()

    new_user = UserModel(
        nama=data.nama,
        username=data.username,
        email=data.email,
        password=bcrypt.hash(data.password),
        id_card=data.id_card,
        role=data.role.value
    )

    session.add(new_user)

    session.commit()

    session.refresh(new_user)

    session.close()

    return new_user


# =========================================
# UPDATE USER
# =========================================
def update_user(user_id: int, data):

    session = SessionLocal()

    user = (
        session.query(UserModel)
        .filter(UserModel.id == user_id)
        .first()
    )

    if not user:
        session.close()
        return False

    user.nama = data.nama
    user.username = data.username
    user.email = data.email

    # update password
    if data.password:
        user.password = bcrypt.hash(data.password)

    user.id_card = data.id_card
    user.role = data.role.value

    session.commit()

    session.close()

    return True

def get_rfid_card():

    try:

        response = requests.get(
            "http://192.168.1.5:8000/rfid/latest"
        )

        data = response.json()

        return data.get("id_card")

    except:
        return None