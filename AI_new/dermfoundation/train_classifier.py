"""
train_classifier.py

Pipeline:
  1. Extract Derm Foundation embeddings (cached to .npy so you don't re-run Derm Foundation)
  2. Train MLP (TensorFlow/Keras) + LR + SVM + RF on same embeddings
  3. Per-class confidence logging after each model
  4. Algorithm comparison bar chart (real numbers only)
  5. Save MLP + LabelEncoder separately
"""

import os
import sys
import cv2
import numpy as np
import joblib
import json
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils.class_weight import compute_class_weight

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# ── Paths ─────────────────────────────────────────────────────────────────────
DATA_DIR        = "../training_data"
CACHE_DIR       = "../trained_data/cache"
MODEL_DIR       = "../trained_data"
MLP_PATH        = os.path.join(MODEL_DIR, "mlp_classifier.keras")
LE_PATH         = os.path.join(MODEL_DIR, "label_encoder.pkl")
EMBEDDINGS_PATH = os.path.join(CACHE_DIR, "embeddings.npy")
LABELS_PATH     = os.path.join(CACHE_DIR, "labels.npy")
CHART_PATH      = os.path.join(MODEL_DIR, "algorithm_comparison.png")
PERCLASS_PATH   = os.path.join(MODEL_DIR, "per_class_report.json")

APPLY_SEGMENTATION = False
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# ── Imports ───────────────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from embedder import get_embedding
from preprocessing.segment import segment_skin_color_array


# ══════════════════════════════════════════════════════════════════════════════
# STEP 1 — Extract embeddings (cached)
# ══════════════════════════════════════════════════════════════════════════════

def extract_embeddings():
    if os.path.exists(EMBEDDINGS_PATH) and os.path.exists(LABELS_PATH):
        print("✅ Loading cached embeddings...")
        X = np.load(EMBEDDINGS_PATH)
        y = np.load(LABELS_PATH, allow_pickle=True)
        return X, y

    print("🔄 Extracting embeddings (this will take a while)...")
    X, y = [], []

    for label in sorted(os.listdir(DATA_DIR)):
        folder = os.path.join(DATA_DIR, label)
        if not os.path.isdir(folder):
            continue

        files = [
            f for f in os.listdir(folder)
            if os.path.splitext(f)[1].lower() in IMAGE_EXTS
        ]

        print(f"\n  [{label}] — {len(files)} images")

        for file in files:
            path = os.path.join(folder, file)
            try:
                img = cv2.imread(path)
                if img is None:
                    print(f"    ⚠️ Skipped (unreadable): {file}")
                    continue

                emb = get_embedding(path, apply_segmentation=APPLY_SEGMENTATION)

                if emb is None or np.isnan(emb).any():
                    print(f"    ⚠️ Skipped (invalid embedding): {file}")
                    continue

                X.append(emb)
                y.append(label)
                print(f"    ✅ {file}")

            except Exception as e:
                print(f"    ❌ {file}: {e}")
                continue

    X = np.array(X)
    y = np.array(y)

    np.save(EMBEDDINGS_PATH, X)
    np.save(LABELS_PATH, y)
    print(f"\n✅ Embeddings cached: {X.shape}")
    return X, y


# ══════════════════════════════════════════════════════════════════════════════
# STEP 2 — Per-class confidence logger
# ══════════════════════════════════════════════════════════════════════════════

def log_per_class_confidence(model_name, y_test, y_pred, proba, class_names):
    print(f"\n{'='*60}")
    print(f"  Per-class report: {model_name}")
    print(f"{'='*60}")
    print(classification_report(y_test, y_pred, target_names=class_names))

    per_class = {}
    for idx, cls in enumerate(class_names):
        mask_correct = (y_test == idx) & (y_pred == idx)
        mask_wrong   = (y_test == idx) & (y_pred != idx)

        avg_conf_correct = float(proba[mask_correct, idx].mean()) if mask_correct.sum() > 0 else 0.0
        avg_conf_wrong   = float(proba[mask_wrong,   idx].mean()) if mask_wrong.sum()   > 0 else 0.0

        per_class[cls] = {
            "avg_confidence_correct": round(avg_conf_correct, 4),
            "avg_confidence_wrong":   round(avg_conf_wrong,   4),
            "correct_count":          int(mask_correct.sum()),
            "wrong_count":            int(mask_wrong.sum()),
        }
        print(
            f"  {cls:<40} "
            f"conf_correct={avg_conf_correct:.2%}  "
            f"conf_wrong={avg_conf_wrong:.2%}"
        )

    return per_class


# ══════════════════════════════════════════════════════════════════════════════
# STEP 3 — Train all models
# ══════════════════════════════════════════════════════════════════════════════

def train_all(X_train, X_test, y_train, y_test, class_names, class_weights_dict):
    results       = {}
    per_class_all = {}

    sklearn_models = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=42, class_weight="balanced"
        ),
        "SVM": SVC(
            kernel="rbf", probability=True, random_state=42, class_weight="balanced"
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=100, random_state=42, class_weight="balanced"
        ),
    }

    for name, clf in sklearn_models.items():
        print(f"\n🔄 Training {name}...")
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        proba  = clf.predict_proba(X_test)

        results[name] = {
            "Accuracy":  round(accuracy_score(y_test, y_pred), 4),
            "F1 Score":  round(f1_score(y_test, y_pred, average="weighted"), 4),
            "Precision": round(precision_score(y_test, y_pred, average="weighted", zero_division=0), 4),
            "Recall":    round(recall_score(y_test, y_pred, average="weighted"), 4),
        }

        per_class_all[name] = log_per_class_confidence(name, y_test, y_pred, proba, class_names)
        print(f"  ✅ {name}: accuracy={results[name]['Accuracy']:.2%}")

    # ── MLP ───────────────────────────────────────────────────────────────────
    print(f"\n🔄 Training MLP...")
    num_classes = len(class_names)
    y_train_cat = tf.keras.utils.to_categorical(y_train, num_classes)
    y_test_cat  = tf.keras.utils.to_categorical(y_test,  num_classes)

    mlp = Sequential([
        Dense(512, activation="relu", input_shape=(X_train.shape[1],)),
        Dropout(0.3),
        Dense(256, activation="relu"),
        Dropout(0.3),
        Dense(num_classes, activation="softmax"),
    ])
    mlp.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    early_stop = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)

    mlp.fit(
        X_train, y_train_cat,
        validation_data=(X_test, y_test_cat),
        epochs=50,
        batch_size=32,
        class_weight=class_weights_dict,
        callbacks=[early_stop],
        verbose=1,
    )

    proba_mlp  = mlp.predict(X_test)
    y_pred_mlp = np.argmax(proba_mlp, axis=1)

    results["MLP"] = {
        "Accuracy":  round(accuracy_score(y_test, y_pred_mlp), 4),
        "F1 Score":  round(f1_score(y_test, y_pred_mlp, average="weighted"), 4),
        "Precision": round(precision_score(y_test, y_pred_mlp, average="weighted", zero_division=0), 4),
        "Recall":    round(recall_score(y_test, y_pred_mlp, average="weighted"), 4),
    }

    per_class_all["MLP"] = log_per_class_confidence("MLP", y_test, y_pred_mlp, proba_mlp, class_names)
    print(f"  ✅ MLP: accuracy={results['MLP']['Accuracy']:.2%}")

    mlp.save(MLP_PATH)
    print(f"✅ MLP saved to {MLP_PATH}")

    return results, per_class_all, mlp


# ══════════════════════════════════════════════════════════════════════════════
# STEP 4 — Comparison chart
# ══════════════════════════════════════════════════════════════════════════════

def plot_comparison(results: dict):
    rows = []
    for model, metrics in results.items():
        for metric, value in metrics.items():
            rows.append({"Model": model, "Metric": metric, "Score": value})

    df = pd.DataFrame(rows)

    plt.figure(figsize=(12, 6))
    sns.barplot(data=df, x="Model", y="Score", hue="Metric")
    plt.title("Algorithm Comparison — DermaScan+ Classifier Heads")
    plt.ylim(0, 1)
    plt.tight_layout()
    plt.savefig(CHART_PATH, dpi=300)
    plt.close()
    print(f"✅ Chart saved to {CHART_PATH}")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    X, y_raw = extract_embeddings()

    le = LabelEncoder()
    y  = le.fit_transform(y_raw)
    joblib.dump(le, LE_PATH)
    print(f"✅ Classes ({len(le.classes_)}): {list(le.classes_)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    weights = compute_class_weight("balanced", classes=np.unique(y_train), y=y_train)
    class_weights_dict = dict(enumerate(weights))

    results, per_class_all, mlp = train_all(
        X_train, X_test, y_train, y_test,
        le.classes_, class_weights_dict
    )

    with open(PERCLASS_PATH, "w") as f:
        json.dump(per_class_all, f, indent=2)
    print(f"✅ Per-class report saved to {PERCLASS_PATH}")

    plot_comparison(results)

    print("\n📊 Final Results:")
    for model, metrics in results.items():
        print(f"  {model:<22} acc={metrics['Accuracy']:.2%}  f1={metrics['F1 Score']:.2%}")