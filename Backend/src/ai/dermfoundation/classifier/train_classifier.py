import os
import numpy as np
from embedder import get_embedding
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import joblib

DATA_DIR = "../data"

X, y = [], []
for label in os.listdir(DATA_DIR):
    folder = os.path.join(DATA_DIR, label)
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        emb = get_embedding(path)
        X.append(emb)
        y.append(label)
        print(f"Processed {label}/{file}")

X = np.array(X)
y = np.array(y)

le = LabelEncoder()
y_enc = le.fit_transform(y)

clf = LogisticRegression(max_iter=1000)
clf.fit(X, y_enc)
print("Classifier trained.")

joblib.dump((clf, le), "skin_classifier.pkl")
print("Saved model to skin_classifier.pkl")
