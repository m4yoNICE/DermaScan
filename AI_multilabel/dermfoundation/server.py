from fastapi import FastAPI, Request, HTTPException
import joblib
import numpy as np
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError
import os
import uvicorn

app = FastAPI()

LR_PATH      = os.path.join(os.path.dirname(__file__), "../trained_data/lr_classifier.pkl")
lr_classifier, mlb = joblib.load(LR_PATH)

@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()
        emb = get_embedding(image_data).reshape(1, -1)

        y_pred_list = lr_classifier.predict_proba(emb)
        cols = [y_pred_list[i][:, 1] for i in range(len(mlb.classes_))]
        proba = np.column_stack(cols)[0]

        # Only look at full labels (condition-severity pairs)
        full_label_indices = [
            i for i, c in enumerate(mlb.classes_)
            if c.endswith(("-mild", "-moderate", "-severe"))
        ]

        # Get all full labels above threshold
        THRESHOLD = 0.3
        detected = [
            {
                "label": mlb.classes_[i],
                "condition": mlb.classes_[i].rsplit("-", 1)[0],
                "severity": mlb.classes_[i].rsplit("-", 1)[1],
                "confidence": float(proba[i])
            }
            for i in full_label_indices
            if proba[i] >= THRESHOLD
        ]

        # Sort by confidence descending
        detected = sorted(detected, key=lambda x: x["confidence"], reverse=True)

        # Primary is always highest confidence
        primary = detected[0] if detected else None

        # Fallback if nothing above threshold
        if not detected:
            best_idx = max(full_label_indices, key=lambda i: proba[i])
            best_label = mlb.classes_[best_idx]
            primary = {
                "label": best_label,
                "condition": best_label.rsplit("-", 1)[0],
                "severity": best_label.rsplit("-", 1)[1],
                "confidence": float(proba[best_idx])
            }
            detected = [primary]

        return {
            "primary_prediction": primary["label"],
            "condition": primary["condition"],
            "severity": primary["severity"],
            "confidence": primary["confidence"],
            "can_recommend": primary["label"] != "out-of-scope",
            "detected_conditions": detected,  # all conditions found
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