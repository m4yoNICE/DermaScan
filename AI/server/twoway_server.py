from fastapi import FastAPI, Request, HTTPException
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))

from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError
import joblib
import numpy as np
import json
import uvicorn

app = FastAPI()

# ── Load models at startup ────────────────────────────────────────────────────
BASE = os.path.join(os.path.dirname(__file__), "../newtraineddata")

print("Loading Stage 1 condition model...")
stage1, le1 = joblib.load(os.path.join(BASE, "stage1_condition.pkl"))
print(f"  Stage 1 loaded. Classes: {list(le1.classes_)}")

print("Loading severity index...")
with open(os.path.join(BASE, "severity_index.json")) as f:
    severity_index = json.load(f)
print(f"  Severity index loaded. Conditions: {list(severity_index.keys())}")

print("Loading severity classifiers...")
severity_classifiers = {}
for condition, path in severity_index.items():
    severity_classifiers[condition] = joblib.load(os.path.join(BASE, path))
    print(f"  Loaded: {condition}")

print("All models loaded. Server ready.\n")

CONFIDENCE_THRESHOLD = 0.6

# ── Inference ─────────────────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()
        print("\n>>> New request received")

        print("  Extracting embedding...")
        emb = get_embedding(image_data).reshape(1, -1)
        print(f"  Embedding shape: {emb.shape}")

        # Stage 1: condition
        print("  Running Stage 1: condition classifier...")
        proba1 = stage1.predict_proba(emb)[0]
        top_idx = np.argsort(proba1)[-3:][::-1]
        top3_conditions = [
            {"label": le1.classes_[i], "score": float(proba1[i])}
            for i in top_idx
        ]

        top_condition = top3_conditions[0]["label"]
        top_confidence = top3_conditions[0]["score"]
        print(f"  Top condition: {top_condition} ({top_confidence:.2%})")
        print(f"  Top 3: {top3_conditions}")

        if top_condition == "out-of-scope" or top_confidence < CONFIDENCE_THRESHOLD:
            print(f"  Rejected: out-of-scope or low confidence ({top_confidence:.2%})")
            return {
                "primary_prediction": "out-of-scope",
                "top3": top3_conditions,
            }

        # Stage 2: severity
        severity = None
        if top_condition in severity_classifiers:
            print(f"  Running Stage 2: severity classifier for [{top_condition}]...")
            lr_sev, le_sev = severity_classifiers[top_condition]
            sev_proba = lr_sev.predict_proba(emb)[0]
            sev_idx = np.argmax(sev_proba)
            severity = le_sev.classes_[sev_idx]
            print(f"  Severity: {severity} ({float(sev_proba[sev_idx]):.2%})")
        else:
            print(f"  No severity model for [{top_condition}] — skipping Stage 2")

        def build_label(condition, is_primary=False):
            if severity and condition in severity_classifiers and is_primary:
                return f"{condition}-{severity}"
            return condition

        top3 = [
            {
                "label": build_label(item["label"], is_primary=(i == 0)),
                "score": item["score"]
            }
            for i, item in enumerate(top3_conditions)
        ]

        primary = build_label(top_condition, is_primary=True)
        print(f"  Final prediction: {primary}")

        return {
            "primary_prediction": primary,
            "top3": top3,
        }

    except ImagePreprocessingError as e:
        print(f"  Image preprocessing error: {e}")
        raise HTTPException(status_code=400, detail=f"Image validation failed: {str(e)}")
    except Exception as e:
        print(f"  Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000, workers=1)