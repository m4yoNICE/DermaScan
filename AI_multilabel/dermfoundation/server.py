# inference_server.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import joblib
import numpy as np
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError
import os
import uvicorn

app = FastAPI()

# Load model ONCE at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/skin_classifier.pkl")
clf, le = joblib.load(MODEL_PATH)

@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()
        
        emb = get_embedding(image_data).reshape(1, -1)
        preds = clf.predict(emb)
        proba = clf.predict_proba(emb)[0]
        
        top_idx = np.argsort(proba)[-3:][::-1]
        top3 = [
            {"label": le.classes_[i], "score": float(proba[i])}
            for i in top_idx
        ]
        
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