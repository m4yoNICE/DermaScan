from fastapi import FastAPI, Request, HTTPException
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))

from embedder import get_embedding
import joblib
import numpy as np
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError
import uvicorn

app = FastAPI()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/merged/lr_classifier.pkl")
clf, le = joblib.load(MODEL_PATH)

CONFUSED_PAIRS = {
    "milia":                         "acne-whiteheads",
    "acne-papules":                  "acne-pustules",
    "acne-pustules":                 "acne-papules",
    "melasma":                       "post-inflammatory-pigmentation",
    "post-inflammatory-pigmentation": "melasma",
    "post-inflammatory-erythema":    "post-inflammatory-pigmentation",
    "eczema":                        "post-inflammatory-erythema",
}

GAP_THRESHOLD = 0.3
BUMP = 0.15

def apply_calibration(top3):
    top1_label = top3[0]["label"]
    top1_score = top3[0]["score"]

    if top1_label not in CONFUSED_PAIRS:
        return top3

    confused_with = CONFUSED_PAIRS[top1_label]

    for item in top3:
        if item["label"] == confused_with:
            gap = top1_score - item["score"]
            if gap < GAP_THRESHOLD:
                item["score"] += BUMP
            break

    top3.sort(key=lambda x: x["score"], reverse=True)
    return top3

@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()

        emb = get_embedding(image_data).reshape(1, -1)
        proba = clf.predict_proba(emb)[0]

        top_idx = np.argsort(proba)[-3:][::-1]
        top3 = [
            {"label": le.classes_[i], "score": float(proba[i])}
            for i in top_idx
        ]

        top3 = apply_calibration(top3)

        return {
            "primary_prediction": top3[0]["label"],
            "top3": top3,
        }

    except ImagePreprocessingError as e:
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000, workers=1)