import cv2
from ultralytics import YOLO
from services.slot_service import update_slot_status
from services.history_service import add_history
from config import (
    YOLO_MODEL_PATH,
    DETECTION_INTERVAL,
    CONFIDENCE_THRESHOLD,
    SLOT_MAPPING,
    SKIP_FRAMES
)
import time

TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080

# ✅ FIXED: Class ID Mobil yang sudah dikonfirmasi
CAR_CLASS_ID = 0 

class YoloService:
    def __init__(self):
        print("🔄 Loading YOLO model...")
        self.model = YOLO(YOLO_MODEL_PATH)
        self.model.fuse()
        self.cache_status = {}
        self.slot_mapping = SLOT_MAPPING
        # Inisialisasi cache status awal
        for kode in SLOT_MAPPING.keys():
            self.cache_status[kode] = 'kosong'

        print("✅ YOLO model loaded!")
        
        # Stabilizer untuk mencegah flicker
        self.detection_buffer = {kode: [] for kode in SLOT_MAPPING.keys()}
        self.BUFFER_SIZE = 3 

    def calculate_iou(self, box1, box2):
        """Intersection over Union (IoU)"""
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2
        
        # Intersection
        x1_i = max(x1_1, x1_2)
        y1_i = max(y1_1, y1_2)
        x2_i = min(x2_1, x2_2)
        y2_i = min(y2_1, y2_2)
        
        if x2_i < x1_i or y2_i < y1_i:
            return 0.0
        
        intersection = (x2_i - x1_i) * (y2_i - y1_i)
        
        # Union
        area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
        area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
        union = area1 + area2 - intersection
        
        return intersection / union if union > 0 else 0.0

    def calculate_overlap_with_slot(self, detection_box, slot_box):
        """Hitung persentase area slot yang tertutup mobil"""
        x1_1, y1_1, x2_1, y2_1 = detection_box
        x1_2, y1_2, x2_2, y2_2 = slot_box
        
        # Intersection
        x1_i = max(x1_1, x1_2)
        y1_i = max(y1_1, y1_2)
        x2_i = min(x2_1, x2_2)
        y2_i = min(y2_1, y2_2)
        
        if x2_i < x1_i or y2_i < y1_i:
            return 0.0
        
        intersection = (x2_i - x1_i) * (y2_i - y1_i)
        slot_area = (x2_2 - x1_2) * (y2_2 - y1_2)
        
        return intersection / slot_area if slot_area > 0 else 0.0

    def analyze_slots(self, results):
        """Algoritma deteksi slot"""
        status_dict = {}
        detected_boxes = []

        if len(results.boxes) > 0:
            for box, cls, conf in zip(results.boxes.xyxy, results.boxes.cls, results.boxes.conf):
                if int(cls.item()) == CAR_CLASS_ID: 
                    detected_boxes.append({
                        'box': box.cpu().numpy(),
                        'conf': conf.item()
                    })

        for kode, (x1, y1, x2, y2) in self.slot_mapping.items():
            slot_box = (x1, y1, x2, y2)
            
            best_iou = 0.0
            best_overlap = 0.0
            detected = False

            for det in detected_boxes:
                det_box = tuple(det['box'])
                
                iou = self.calculate_iou(det_box, slot_box)
                best_iou = max(best_iou, iou)
                
                overlap = self.calculate_overlap_with_slot(det_box, slot_box)
                best_overlap = max(best_overlap, overlap)
                
                # THRESHOLD: IoU > 0.3 atau Overlap > 0.4
                if iou > 0.3 or overlap > 0.4:
                    detected = True
                    break

            status_dict[kode] = {
                'status': 'terisi' if detected else 'kosong',
                'iou': round(best_iou, 3),
                'overlap': round(best_overlap, 3)
            }

        return status_dict

    def stabilize_status(self, kode, new_status):
        """Stabilizer untuk mencegah LED flicker"""
        buffer = self.detection_buffer[kode]
        buffer.append(new_status)
        
        if len(buffer) > self.BUFFER_SIZE:
            buffer.pop(0)
        
        if len(buffer) == self.BUFFER_SIZE:
            terisi_count = sum(1 for s in buffer if s == 'terisi')
            if terisi_count >= 2: 
                return 'terisi'
            else:
                return 'kosong'
        
        return self.cache_status.get(kode, 'kosong')

    def run(self):
        """
        ⚠️ PERINGATAN: Method ini TIDAK DIGUNAKAN lagi!
        
        Streaming kamera sekarang 100% dilakukan oleh camera_route.py
        File ini hanya untuk import class YoloService jika diperlukan.
        
        Jika Anda menjalankan python yolo_service.py, tidak ada yang terjadi.
        """
        print("=" * 60)
        print("⚠️  PERINGATAN: yolo_service.py tidak boleh dijalankan langsung!")
        print("=" * 60)
        print("📌 Streaming kamera sekarang 100% di-handle oleh camera_route.py")
        print("📌 Untuk menjalankan aplikasi, gunakan:")
        print("   python main.py")
        print("=" * 60)
        return


if __name__ == "__main__":
    print("\n🚫 ERROR: Jangan jalankan file ini langsung!\n")
    print("✅ Cara yang benar:")
    print("   1. Jalankan: python main.py")
    print("   2. Backend akan streaming otomatis via /camera/feed")
    print("   3. Frontend akan consume stream tersebut\n")