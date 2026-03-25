from fastapi import FastAPI, Request, HTTPException
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))

from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError
import joblib
import numpy as np
import uvicorn

app = FastAPI()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/merged/lr_classifier.pkl")
clf, le = joblib.load(MODEL_PATH)

CONFUSED_PAIRS = {
    "milia":                          "acne-whiteheads",
    "acne-whiteheads":                "milia",
    "acne-papules":                   "acne-pustules",
    "acne-pustules":                  "acne-papules",
    "acne-cyst":                      "acne-nodules",
    "acne-nodules":                   "acne-cyst",
    "melasma":                        "post-inflammatory-pigmentation",
    "post-inflammatory-pigmentation": "melasma",
    "post-inflammatory-erythema":     "post-inflammatory-pigmentation",
    "eczema":                         "post-inflammatory-erythema",
}

GAP_THRESHOLD = 0.3
BUMP = 0.15

def apply_calibration(all_preds):
    top1_label = all_preds[0]["label"]
    top1_score = all_preds[0]["score"]

    if top1_label not in CONFUSED_PAIRS:
        return all_preds

    confused_with = CONFUSED_PAIRS[top1_label]

    for item in all_preds:
        if item["label"] == confused_with:
            gap = top1_score - item["score"]
            print(f"[CALIBRATION] top1={top1_label} ({top1_score:.4f}) | confused_with={confused_with} ({item['score']:.4f}) | gap={gap:.4f}")
            if gap < GAP_THRESHOLD:
                print(f"[CALIBRATION] Bumping {confused_with} by {BUMP}")
                item["score"] += BUMP
            else:
                print(f"[CALIBRATION] Gap too large, no bump applied")
            break

    all_preds.sort(key=lambda x: x["score"], reverse=True)
    return all_preds

def analyze_image(image_data: bytes):
    emb = get_embedding(image_data).reshape(1, -1)
    proba = clf.predict_proba(emb)[0]

    all_preds = [
        {"label": le.classes_[i], "score": float(proba[i])}
        for i in range(len(le.classes_))
    ]
    all_preds.sort(key=lambda x: x["score"], reverse=True)

    print("\n[PRE-CALIBRATION] All predictions:")
    for p in all_preds:
        print(f"  {p['label']}: {p['score']:.4f}")

    calibrated = apply_calibration(all_preds)

    print("\n[POST-CALIBRATION] Top 10:")
    for p in calibrated[:10]:
        print(f"  {p['label']}: {p['score']:.4f}")

    return calibrated[:3]

@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()
        top3 = analyze_image(image_data)

        return {
            "primary_prediction": top3[0]["label"],
            "top3": top3,
        }

    except ImagePreprocessingError as e:
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000, workers=1)