import cv2
from ultralytics import YOLO
from services.slot_service import update_slot_status
from services.history_service import add_history
from config import YOLO_MODEL_PATH, DETECTION_INTERVAL
import time

class YoloService:
    def __init__(self):
        self.model = YOLO(YOLO_MODEL_PATH)
        self.cache_status = {}  # simpan status terakhir slot

    def analyze_frame(self, frame):
        # TODO: implement logic mapping hasil YOLO ke slot
        # contoh sementara:
        return {"A1": "terisi", "A2": "kosong"}

    def run(self):
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            detected_slots = self.analyze_frame(frame)

            for kode, status in detected_slots.items():
                last_status = self.cache_status.get(kode)
                if last_status != status:
                    # aktivitas parkir_masuk jika berubah ke terisi
                    aktivitas = "parkir_masuk" if status == "terisi" else "parkir_keluar"
                    update_slot_status(kode, status)
                    add_history(kode, aktivitas)
                    self.cache_status[kode] = status

            time.sleep(DETECTION_INTERVAL)
