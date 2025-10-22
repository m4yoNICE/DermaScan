import joblib
import numpy as np
from embedder import get_embedding
import os
clf, le = joblib.load("skin_classifier.pkl")
test_img = "../../../skinUploads/acneoten.jpg" # change as needed
emb = get_embedding(test_img).reshape(1, -1)

#predict here
pred_index = clf.predict(emb)[0]
pred_label = le.inverse_transform(clf.predict(emb))[0]

proba = clf.predict_proba(emb)[0]
print("Predicted class:", pred_label)
print("Scores:")
for label, score in zip(le.classes_, proba):
    print(f"{label}: {score:.4f}")