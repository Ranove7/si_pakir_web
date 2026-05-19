from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# simpan sementara RFID terakhir
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

    return latest_rfid