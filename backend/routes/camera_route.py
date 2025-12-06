from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
import cv2
from ultralytics import YOLO
from config import (
    YOLO_MODEL_PATH,
    CONFIDENCE_THRESHOLD,
    SLOT_MAPPING,
)
from services.slot_service import update_slot_status, get_all_slots
from services.history_service import add_history
import time
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# ✅ Load YOLO model (shared instance)
yolo_model = None

# ✅ CRITICAL: cache_status sebagai SINGLE SOURCE OF TRUTH
# Variable ini di-export untuk digunakan oleh esp_route.py
cache_status = {}

def get_yolo_model():
    """Singleton pattern untuk YOLO model"""
    global yolo_model
    if yolo_model is None:
        print("🔄 Loading YOLO model for streaming...")
        yolo_model = YOLO(YOLO_MODEL_PATH)
        yolo_model.fuse()
        print("✅ YOLO model loaded for streaming!")
    return yolo_model

# Class ID untuk mobil
CAR_CLASS_ID = 0

# Stabilizer untuk mencegah flicker
detection_buffer = {kode: [] for kode in SLOT_MAPPING.keys()}
BUFFER_SIZE = 3

def calculate_iou(box1, box2):
    """Intersection over Union (IoU)"""
    x1_1, y1_1, x2_1, y2_1 = box1
    x1_2, y1_2, x2_2, y2_2 = box2
    
    x1_i = max(x1_1, x1_2)
    y1_i = max(y1_1, y1_2)
    x2_i = min(x2_1, x2_2)
    y2_i = min(y2_1, y2_2)
    
    if x2_i < x1_i or y2_i < y1_i:
        return 0.0
    
    intersection = (x2_i - x1_i) * (y2_i - y1_i)
    area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
    area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
    union = area1 + area2 - intersection
    
    return intersection / union if union > 0 else 0.0

def calculate_overlap_with_slot(detection_box, slot_box):
    """Hitung persentase area slot yang tertutup mobil"""
    x1_1, y1_1, x2_1, y2_1 = detection_box
    x1_2, y1_2, x2_2, y2_2 = slot_box
    
    x1_i = max(x1_1, x1_2)
    y1_i = max(y1_1, y1_2)
    x2_i = min(x2_1, x2_2)
    y2_i = min(y2_1, y2_2)
    
    if x2_i < x1_i or y2_i < y1_i:
        return 0.0
    
    intersection = (x2_i - x1_i) * (y2_i - y1_i)
    slot_area = (x2_2 - x1_2) * (y2_2 - y1_2)
    
    return intersection / slot_area if slot_area > 0 else 0.0

def analyze_slots(results):
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

    for kode, (x1, y1, x2, y2) in SLOT_MAPPING.items():
        slot_box = (x1, y1, x2, y2)
        
        best_iou = 0.0
        best_overlap = 0.0
        detected = False

        for det in detected_boxes:
            det_box = tuple(det['box'])
            
            iou = calculate_iou(det_box, slot_box)
            best_iou = max(best_iou, iou)
            
            overlap = calculate_overlap_with_slot(det_box, slot_box)
            best_overlap = max(best_overlap, overlap)
            
            if iou > 0.3 or overlap > 0.4:
                detected = True
                break

        status_dict[kode] = {
            'status': 'terisi' if detected else 'kosong',
            'iou': round(best_iou, 3),
            'overlap': round(best_overlap, 3)
        }

    return status_dict

def stabilize_status(kode, new_status):
    """Stabilizer untuk mencegah LED flicker"""
    global cache_status, detection_buffer
    
    buffer = detection_buffer[kode]
    buffer.append(new_status)
    
    if len(buffer) > BUFFER_SIZE:
        buffer.pop(0)
    
    if len(buffer) == BUFFER_SIZE:
        terisi_count = sum(1 for s in buffer if s == 'terisi')
        if terisi_count >= 2: 
            return 'terisi'
        else:
            return 'kosong'
    
    return cache_status.get(kode, 'kosong')

def generate_yolo_frames(show_boxes: bool = True):
    """Generator untuk streaming frame dengan YOLO detection"""
    global cache_status
    
    camera = cv2.VideoCapture(0)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    camera.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    
    model = get_yolo_model()
    
    # ✅ Inisialisasi cache status dari database
    logger.info("🔄 Initializing cache_status from database...")
    initial_slots = get_all_slots()
    for slot in initial_slots:
        cache_status[slot.kode_parkir] = slot.status
    logger.info(f"✅ Cache initialized: {cache_status}")
    
    frame_count = 0
    
    try:
        while True:
            success, frame = camera.read()
            if not success:
                break
            
            frame_count += 1
            
            # Resize frame
            frame = cv2.resize(frame, (1920, 1080))
            
            # ✅ YOLO Detection (selalu jalan untuk update database)
            results = model(frame, verbose=False, conf=CONFIDENCE_THRESHOLD)[0]
            
            # ✅ Analyze slots
            detected_slots = analyze_slots(results)
            
            # ✅ Update database dengan stabilizer
            for kode, data in detected_slots.items():
                raw_status = data['status']
                stable_status = stabilize_status(kode, raw_status)
                
                old_status = cache_status.get(kode)
                
                # ✅ CRITICAL: Update HANYA jika status berubah
                if old_status != stable_status:
                    aktivitas = "parkir_masuk" if stable_status == "terisi" else "parkir_keluar"
                    
                    # ✅ UPDATE DATABASE & CACHE secara atomik
                    update_slot_status(kode, stable_status)
                    cache_status[kode] = stable_status  # Update cache SETELAH database
                    add_history(kode, aktivitas)
                    
                    logger.info(f"♻️ [{kode}] {old_status} → {stable_status} | IoU:{data['iou']} OVR:{data['overlap']}")
            
            # ✅ Conditional Drawing berdasarkan show_boxes
            if show_boxes:
                # Draw YOLO detections (bounding boxes mobil)
                annotated = results.plot()
                
                # Draw slot boxes dengan status
                for kode, data in detected_slots.items():
                    x1, y1, x2, y2 = SLOT_MAPPING[kode]
                    
                    # ✅ Ambil status dari cache (SINGLE SOURCE OF TRUTH)
                    current_stable_status = cache_status.get(kode, 'kosong')
                    
                    # Tentukan warna berdasarkan status
                    color = (0, 0, 255) if current_stable_status == "terisi" else (0, 255, 0)
                    status_text = "TERISI" if current_stable_status == "terisi" else "KOSONG"
                    
                    # Rectangle slot
                    cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)
                    
                    # Label slot dengan kode
                    label = f"{kode}"
                    label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
                    
                    # Background label
                    cv2.rectangle(annotated, 
                                (x1, y1 - label_size[1] - 15), 
                                (x1 + label_size[0] + 10, y1), 
                                color, -1)
                    
                    # Teks label
                    cv2.putText(annotated, label, (x1 + 5, y1 - 8),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                    
                    # Status text di bawah slot
                    status_size = cv2.getTextSize(status_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
                    cv2.rectangle(annotated,
                                (x1, y2),
                                (x1 + status_size[0] + 10, y2 + status_size[1] + 15),
                                color, -1)
                    
                    cv2.putText(annotated, status_text, (x1 + 5, y2 + status_size[1] + 8),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                    
                    # Info IoU & Overlap (kecil)
                    info_text = f"IoU:{data['iou']} OVR:{data['overlap']}"
                    cv2.putText(annotated, info_text, (x1, y1 - label_size[1] - 20),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)
                
                # Add title/header
                cv2.putText(annotated, "SI-PARKIR - YOLO Detection", (20, 40),
                           cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
                
                # Add timestamp
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
                cv2.putText(annotated, timestamp, (20, 80),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                
                # Add live indicator
                cv2.circle(annotated, (1880, 40), 15, (0, 0, 255), -1)
                cv2.putText(annotated, "LIVE", (1820, 50),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            else:
                # ✅ CLEAN MODE - Tanpa boxes, hanya raw frame
                annotated = frame.copy()
                
                # Add minimal info
                cv2.putText(annotated, "SI-PARKIR - Clean View", (20, 40),
                           cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
                
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
                cv2.putText(annotated, timestamp, (20, 80),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                
                # Live indicator
                cv2.circle(annotated, (1880, 40), 15, (0, 255, 0), -1)
                cv2.putText(annotated, "LIVE", (1820, 50),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            
            # Encode frame ke JPEG
            ret, buffer = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                continue
            
            frame_bytes = buffer.tobytes()
            
            # Yield dalam format multipart
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
    finally:
        camera.release()
        logger.info("🔴 Camera released")

@router.get("/feed")
async def video_feed(show_boxes: bool = Query(True, description="Show YOLO boxes and slot boxes")):
    """Endpoint untuk streaming video dengan YOLO detection"""
    return StreamingResponse(
        generate_yolo_frames(show_boxes),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.get("/status")
async def camera_status():
    """Check camera status"""
    cap = cv2.VideoCapture(0)
    is_opened = cap.isOpened()
    cap.release()
    return {
        "status": "online" if is_opened else "offline",
        "yolo_enabled": True,
        "model": YOLO_MODEL_PATH,
        "cache_status": cache_status
    }

@router.get("/cache")
async def get_cache_status():
    """
    ✅ NEW: Endpoint untuk melihat cache status real-time
    Berguna untuk debugging
    """
    return {
        "cache": cache_status,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }