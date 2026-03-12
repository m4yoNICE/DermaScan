"""
inference_server.py

Loads MLP (Keras) + LabelEncoder (joblib) at startup.
POST /analyze  — accepts raw image bytes, returns top3 predictions
GET  /health   — liveness check
"""

from fastapi import FastAPI, Request, HTTPException
import numpy as np
import joblib
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import uvicorn

from tensorflow.keras.models import load_model
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError

app = FastAPI()

# ── Load once at startup ──────────────────────────────────────────────────────
BASE = os.path.dirname(__file__)

MLP_PATH = os.path.join(BASE, "../trained_data/mlp_classifier.keras")
LE_PATH  = os.path.join(BASE, "../trained_data/label_encoder.pkl")

print("Loading MLP classifier...")
mlp = load_model(MLP_PATH)

print("Loading label encoder...")
le = joblib.load(LE_PATH)

print(f"✅ Ready — {len(le.classes_)} classes: {list(le.classes_)}")

# ── Config ────────────────────────────────────────────────────────────────────
APPLY_SEGMENTATION    = True   # must match what you used during training
TOP_N                 = 3


@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()

        emb   = get_embedding(
            image_data,
            apply_segmentation=APPLY_SEGMENTATION
        ).reshape(1, -1)

        proba = mlp.predict(emb, verbose=0)[0]

        top_idx = np.argsort(proba)[-TOP_N:][::-1]
        top3 = [
            {"label": le.classes_[i], "score": float(proba[i])}
            for i in top_idx
        ]

        return {
            "primary_prediction": top3[0]["label"],
            "confidence":         top3[0]["score"],
            "top3":               top3,
        }

    except ImagePreprocessingError as e:
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "classes": len(le.classes_)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, workers=1)