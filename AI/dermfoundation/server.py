# inference_server.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import joblib
import numpy as np
import cv2
import os
import sys
import uvicorn

from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError, MAX_IMAGE_BYTES

# Allow importing yolo_detector from AI/ (lazy import when YOLO is used)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

app = FastAPI()

# Load classifier ONCE at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/skin_classifier.pkl")
clf, le = joblib.load(MODEL_PATH)

# Lazy-load YOLO (loaded on first analyze request)
# Prefer skin-lesion model if available (run: python download_skin_yolo.py)
_yolo_detector = None
AI_DIR = os.path.join(os.path.dirname(__file__), "..")
SKIN_YOLO_PATH = os.path.join(AI_DIR, "skin_yolov8n_seg.pt")
DEFAULT_YOLO_PATH = os.path.join(AI_DIR, "yolov8n.pt")
YOLO_MODEL_PATH = SKIN_YOLO_PATH if os.path.exists(SKIN_YOLO_PATH) else DEFAULT_YOLO_PATH
USE_YOLO = os.environ.get("USE_YOLO", "true").lower() in ("true", "1", "yes")


def _get_yolo_detector():
    global _yolo_detector
    if _yolo_detector is None and USE_YOLO:
        from yolo_detector import YoloDetector, crop_regions
        _yolo_detector = YoloDetector(YOLO_MODEL_PATH)
    return _yolo_detector


def _analyze_with_yolo_cnn(image_data: bytes) -> dict:
    """
    YOLO + CNN pipeline: detect regions → crop → run DermFoundation on each crop → pick best prediction.
    Falls back to full-image analysis if YOLO finds nothing or is disabled.
    """
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image format")

    crops = []
    try:
        from yolo_detector import crop_regions
        detector = _get_yolo_detector()
        if detector is not None:
            boxes = detector.detect(img)
            crops = crop_regions(img, boxes)
    except Exception:
        pass  # Fall back to full image

    if len(crops) == 0:
        crops = [img]

    predictions = []
    probabilities = []

    for crop in crops:
        # Convert BGR (OpenCV) to RGB for DermFoundation embedder
        crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
        emb = get_embedding(crop_rgb).reshape(1, -1)
        preds = clf.predict(emb)
        proba = clf.predict_proba(emb)[0]
        predictions.append(preds[0])
        probabilities.append(proba)

    # Use the crop with highest confidence
    best_idx = np.argmax([max(p) for p in probabilities])
    best_proba = probabilities[best_idx]

    top_idx = np.argsort(best_proba)[-3:][::-1]
    top3 = [
        {"label": le.classes_[i], "score": float(best_proba[i])}
        for i in top_idx
    ]

    result = {
        "primary_prediction": top3[0]["label"],
        "top3": top3,
    }
    if len(crops) > 1:
        result["regions_analyzed"] = len(crops)

    return result


def _analyze_full_image(image_data: bytes) -> dict:
    """Original full-image-only pipeline (no YOLO)."""
    emb = get_embedding(image_data).reshape(1, -1)
    proba = clf.predict_proba(emb)[0]
    top_idx = np.argsort(proba)[-3:][::-1]
    top3 = [
        {"label": le.classes_[i], "score": float(proba[i])}
        for i in top_idx
    ]
    return {"primary_prediction": top3[0]["label"], "top3": top3}


@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()

        if len(image_data) > MAX_IMAGE_BYTES:
            raise ImagePreprocessingError(
                f"Image exceeds {MAX_IMAGE_BYTES // (1024**2)}MB limit"
            )

        if USE_YOLO and os.path.exists(YOLO_MODEL_PATH):
            result = _analyze_with_yolo_cnn(image_data)
        else:
            result = _analyze_full_image(image_data)

        return result

    except ImagePreprocessingError as e:
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000, workers=1)