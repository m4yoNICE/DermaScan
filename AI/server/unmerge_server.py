from fastapi import FastAPI, Request, HTTPException
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))
import numpy as np
import os
import uvicorn
import tensorflow as tf
import cv2

app = FastAPI()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../trained_data/dermascan_cnn.h5")
model = tf.keras.models.load_model(MODEL_PATH)

CLASSES = [
    "acne-blackheads-mild", "acne-blackheads-moderate", "acne-blackheads-severe",
    "acne-cyst",
    "acne-nodules",
    "acne-papules-mild", "acne-papules-moderate", "acne-papules-severe",
    "acne-pustules-mild", "acne-pustules-moderate", "acne-pustules-severe",
    "acne-whiteheads-mild", "acne-whiteheads-moderate", "acne-whiteheads-severe",
    "eczema-mild", "eczema-moderate", "eczema-severe",
    "enlarged-pores-mild", "enlarged-pores-moderate", "enlarged-pores-severe",
    "melasma-mild", "melasma-moderate", "melasma-severe",
    "milia-mild", "milia-moderate", "milia-severe",
    "out-of-scope",
    "post-inflammatory-erythema-mild", "post-inflammatory-erythema-moderate", "post-inflammatory-erythema-severe",
    "post-inflammatory-pigmentation-mild", "post-inflammatory-pigmentation-moderate", "post-inflammatory-pigmentation-severe",
    "psoriasis",
]

@app.post("/analyze")
async def analyze(request: Request):
    try:
        image_data = await request.body()

        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)

        proba = model.predict(img, verbose=0)[0]

        top_idx = np.argsort(proba)[-3:][::-1]
        top3 = [
            {"label": CLASSES[i], "score": float(proba[i])}
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