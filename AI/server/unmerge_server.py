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

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/unmerged/lr_classifier.pkl")
clf, le = joblib.load(MODEL_PATH)

def analyze_image(image_data: bytes):
    emb = get_embedding(image_data).reshape(1, -1)
    proba = clf.predict_proba(emb)[0]

    all_preds = [
        {"label": le.classes_[i], "score": float(proba[i])}
        for i in range(len(le.classes_))
    ]
    all_preds.sort(key=lambda x: x["score"], reverse=True)

    return all_preds[:3]

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