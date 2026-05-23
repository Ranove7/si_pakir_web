from fastapi import APIRouter, WebSocket, WebSocketDisconnect
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
import numpy as np
import base64
import json

router = APIRouter()
logger = logging.getLogger(__name__)

yolo_model = None

def get_yolo_model():
    global yolo_model
    if yolo_model is None:
        print("🔄 Loading YOLO model...")
        yolo_model = YOLO(YOLO_MODEL_PATH)
        yolo_model.fuse()
        print("✅ YOLO model loaded!")
    return yolo_model

CAR_CLASS_ID = 0
cache_status = {}
detection_buffer = {kode: [] for kode in SLOT_MAPPING.keys()}
BUFFER_SIZE = 3

def calculate_iou(box1, box2):
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
    global cache_status, detection_buffer
    buffer = detection_buffer[kode]
    buffer.append(new_status)
    if len(buffer) > BUFFER_SIZE:
        buffer.pop(0)
    if len(buffer) == BUFFER_SIZE:
        terisi_count = sum(1 for s in buffer if s == 'terisi')
        return 'terisi' if terisi_count >= 2 else 'kosong'
    return cache_status.get(kode, 'kosong')

def draw_annotations(frame, detected_slots, show_boxes: bool):
    annotated = frame.copy()
    for kode, data in detected_slots.items():
        if kode not in SLOT_MAPPING:
            continue
        x1, y1, x2, y2 = SLOT_MAPPING[kode]
        current_status = cache_status.get(kode, 'kosong')
        color = (0, 0, 255) if current_status == "terisi" else (0, 255, 0)
        status_text = "TERISI" if current_status == "terisi" else "KOSONG"

        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)

        label = f"{kode}"
        label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        cv2.rectangle(annotated,
                      (x1, y1 - label_size[1] - 15),
                      (x1 + label_size[0] + 10, y1),
                      color, -1)
        cv2.putText(annotated, label, (x1 + 5, y1 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        status_size = cv2.getTextSize(status_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
        cv2.rectangle(annotated,
                      (x1, y2),
                      (x1 + status_size[0] + 10, y2 + status_size[1] + 15),
                      color, -1)
        cv2.putText(annotated, status_text, (x1 + 5, y2 + status_size[1] + 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        if show_boxes:
            info_text = f"IoU:{data['iou']} OVR:{data['overlap']}"
            cv2.putText(annotated, info_text,
                        (x1, y1 - label_size[1] - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)

    cv2.putText(annotated, "SI-PARKIR - YOLO Detection", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(annotated, timestamp, (20, 75),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    h, w = annotated.shape[:2]
    cv2.circle(annotated, (w - 40, 40), 12, (0, 0, 255), -1)
    cv2.putText(annotated, "LIVE", (w - 90, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    return annotated

@router.websocket("/ws")
async def websocket_camera(websocket: WebSocket):
    global cache_status

    await websocket.accept()
    logger.info("🟢 WebSocket connected")

    try:
        initial_slots = get_all_slots()
        for slot in initial_slots:
            cache_status[slot.kode_parkir] = slot.status
        logger.info(f"✅ Cache initialized: {cache_status}")
    except Exception as e:
        logger.error(f"❌ Failed to init cache: {e}")

    model = get_yolo_model()

    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)

            show_boxes = payload.get("show_boxes", True)
            frame_b64 = payload.get("frame", "")

            if "," in frame_b64:
                frame_b64 = frame_b64.split(",")[1]

            try:
                img_bytes = base64.b64decode(frame_b64)
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception as e:
                logger.warning(f"⚠️ Frame decode error: {e}")
                continue

            if frame is None:
                continue

            results = model(frame, verbose=False, conf=CONFIDENCE_THRESHOLD)[0]
            detected_slots = analyze_slots(results)

            for kode, data in detected_slots.items():
                raw_status = data['status']
                stable_status = stabilize_status(kode, raw_status)
                old_status = cache_status.get(kode)
                if old_status != stable_status:
                    aktivitas = "parkir_masuk" if stable_status == "terisi" else "parkir_keluar"
                    try:
                        update_slot_status(kode, stable_status)
                        cache_status[kode] = stable_status
                        add_history(kode, aktivitas)
                        logger.info(f"♻️ [{kode}] {old_status} → {stable_status}")
                    except Exception as e:
                        logger.error(f"❌ DB update error [{kode}]: {e}")

            if show_boxes:
                annotated = results.plot()
                annotated = draw_annotations(annotated, detected_slots, show_boxes=True)
            else:
                annotated = draw_annotations(frame, detected_slots, show_boxes=False)

            _, buffer = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_b64_out = base64.b64encode(buffer).decode('utf-8')

            await websocket.send_text(json.dumps({
                "frame": f"data:image/jpeg;base64,{frame_b64_out}",
                "slots": cache_status,
                "detected": detected_slots
            }))

    except WebSocketDisconnect:
        logger.info("🔴 WebSocket disconnected")
    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")

@router.get("/status")
async def camera_status():
    return {
        "status": "online",
        "yolo_enabled": True,
        "model": YOLO_MODEL_PATH,
        "cache_status": cache_status
    }

@router.get("/cache")
async def get_cache_status():
    return {
        "cache": cache_status,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }