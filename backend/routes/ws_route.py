from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Import yolo_service dari main (akan di-inject)
yolo_service = None

def set_yolo_service(service):
    """Set YOLO service instance"""
    global yolo_service
    yolo_service = service

@router.websocket("/ws/camera")
async def websocket_camera(websocket: WebSocket):
    """
    WebSocket endpoint untuk streaming kamera dengan YOLO detection
    """
    await websocket.accept()
    logger.info(f"WebSocket connection accepted from {websocket.client}")
    
    if yolo_service is None:
        await websocket.send_json({
            "type": "error",
            "message": "YOLO service not initialized"
        })
        await websocket.close()
        return
    
    # Tambahkan client ke YOLO service
    yolo_service.add_websocket_client(websocket)
    
    try:
        # Kirim message initial
        await websocket.send_json({
            "type": "connected",
            "message": "Connected to camera stream"
        })
        
        # Keep connection alive dan terima message dari client
        while True:
            data = await websocket.receive_text()
            # Handle client message jika perlu (untuk kontrol, dll)
            logger.info(f"Received from client: {data}")
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected from {websocket.client}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # Remove client dari YOLO service
        yolo_service.remove_websocket_client(websocket)