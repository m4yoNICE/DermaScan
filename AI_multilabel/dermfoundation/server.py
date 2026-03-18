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

        # Get proba per label — same reconstruction as training
        y_pred_list = lr_classifier.predict_proba(emb)
        cols = [y_pred_list[i][:, 1] for i in range(len(mlb.classes_))]
        proba = np.column_stack(cols)[0]  # shape: (n_labels,)

        # Threshold at 0.5
        y_bool = (proba >= 0.5).astype(int)
        predicted_labels = mlb.classes_[y_bool.astype(bool)].tolist()

        # Extract structured output
        full_label = next(
            (l for l in predicted_labels
             if l.endswith(("-mild", "-moderate", "-severe"))),
            None
        )
        condition = next(
            (l for l in predicted_labels
             if not l.endswith(("-mild", "-moderate", "-severe"))
             and l not in {"mild", "moderate", "severe"}),
            None
        )
        severity = next(
            (l for l in predicted_labels
             if l in {"mild", "moderate", "severe"}),
            None
        )

        # Top 3 labels by proba score
        top_idx = np.argsort(proba)[-3:][::-1]
        top3 = [
            {"label": mlb.classes_[i], "score": float(proba[i])}
            for i in top_idx
        ]

        return {
            "primary_prediction": full_label or (predicted_labels[0] if predicted_labels else "unknown"),
            "condition": condition,
            "severity": severity,
            "predicted_labels": predicted_labels,
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