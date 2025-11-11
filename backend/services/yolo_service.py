import cv2
from ultralytics import YOLO
from services.slot_service import update_slot_status
from services.history_service import add_history
from config import YOLO_MODEL_PATH, DETECTION_INTERVAL
import time

class YoloService:
    def __init__(self):
        self.model = YOLO(YOLO_MODEL_PATH)
        self.cache_status = {}

        # Mapping slot: kode_slot -> bounding box (x1, y1, x2, y2)
        # 3 kiri (A1-A3), 3 kanan (A4-A6)
        self.slot_mapping = {
            "A1": (50, 50, 150, 150),
            "A2": (50, 180, 150, 280),
            "A3": (50, 310, 150, 410),
            "A4": (490, 50, 590, 150),
            "A5": (490, 180, 590, 280),
            "A6": (490, 310, 590, 410),
        }

    def analyze_frame(self, frame):
        """
        Mendeteksi status slot berdasarkan bounding box YOLO dan class label.
        class: 0 = kosong, 1 = terisi
        """
        results = self.model(frame)[0]
        status_dict = {}

        for kode, (x1, y1, x2, y2) in self.slot_mapping.items():
            detected = False
            for box, cls in zip(results.boxes.xyxy, results.boxes.cls):
                bx1, by1, bx2, by2 = box
                # cek overlap dengan slot
                if bx2 > x1 and bx1 < x2 and by2 > y1 and by1 < y2:
                    # hanya class 1 (terisi) dianggap terisi
                    if int(cls) == 1:
                        detected = True
                        break
            status_dict[kode] = "terisi" if detected else "kosong"

        return status_dict

    def run(self):
        cap = cv2.VideoCapture("http://192.168.1.38:81/stream")  # ubah sesuai kamera
        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            # Jalankan YOLO inference
            results = self.model(frame)
            annotated_frame = results[0].plot()

            # Analisis tiap slot
            detected_slots = self.analyze_frame(frame)
            for kode, status in detected_slots.items():
                last_status = self.cache_status.get(kode)
                if last_status != status:
                    aktivitas = "parkir_masuk" if status == "terisi" else "parkir_keluar"
                    update_slot_status(kode, status)
                    add_history(kode, aktivitas)
                    self.cache_status[kode] = status

                # Gambar kotak slot di frame
                x1, y1, x2, y2 = self.slot_mapping[kode]
                color = (0, 0, 255) if status == "terisi" else (0, 255, 0)  # merah jika terisi, hijau jika kosong
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(annotated_frame, kode, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            # Tampilkan frame
            cv2.imshow("YOLO Parking Camera", annotated_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            time.sleep(DETECTION_INTERVAL)

        cap.release()
        cv2.destroyAllWindows()

# ⬇️ Jalankan langsung
if __name__ == "__main__":
    yolo = YoloService()
    yolo.run()
