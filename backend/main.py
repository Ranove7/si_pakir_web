from fastapi import FastAPI
from routes.slot_route import router as slot_router
from routes.history_route import router as history_router
import threading
from services.yolo_service import YoloService

app = FastAPI()

# include routes
app.include_router(slot_router, prefix="/slots")
app.include_router(history_router, prefix="/history")

# jalankan YOLO di background thread
yolo_service = YoloService()
threading.Thread(target=yolo_service.run, daemon=True).start()
