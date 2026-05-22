from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

latest_rfid = {
    "id_card": None
}


class RFIDRequest(BaseModel):
    id_card: str


# =========================================
# TERIMA RFID DARI ESP8266
# =========================================
@router.post("/scan")
def receive_rfid(data: RFIDRequest):

    latest_rfid["id_card"] = data.id_card

    print("RFID Masuk:", data.id_card)

    return {
        "message": "RFID diterima",
        "id_card": data.id_card
    }


# =========================================
# DIAMBIL OLEH FRONTEND
# =========================================
@router.get("/latest")
def get_latest_rfid():

    card = latest_rfid["id_card"]

    # reset setelah dibaca
    latest_rfid["id_card"] = None

    return {
        "id_card": card
    }
