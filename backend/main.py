from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from routes.slot_route import router as slot_router
from routes.history_route import router as history_router
import threading
from services.yolo_service import YoloService

app = FastAPI()

# Izinkan akses dari frontend localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(slot_router, prefix="/slots")
app.include_router(history_router, prefix="/history")

# jalankan YOLO di background
yolo_service = YoloService()
threading.Thread(target=yolo_service.run, daemon=True).start()
