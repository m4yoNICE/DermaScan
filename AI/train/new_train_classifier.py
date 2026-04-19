import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.utils.class_weight import compute_class_weight

# ── Config ────────────────────────────────────────────────────────────────────
DATA_DIR    = "../training_data"
CACHE_DIR   = "../trained_data/cache"
# CACHE_DIR = "../trained_data/merge_cache"
EMB_PATH  = os.path.join(CACHE_DIR, "embeddings.npy")
LABEL_PATH = os.path.join(CACHE_DIR, "labels.npy")
LR_PATH  = "../trained_data/unmerged/lr_classifier.pkl"
MLP_PATH = "../trained_data/unmerged/mlp_classifier.keras"
LE_PATH  = "../trained_data/unmerged/label_encoder.pkl"
RF_PATH  = "../trained_data/unmerged/rf_classifier.pkl"

os.makedirs("../trained_data/unmerged", exist_ok=True)


IMAGE_EXTS  = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

# ── Step 1: Extract or load embeddings ───────────────────────────────────────
def extract_embeddings():
    from embedder import get_embedding

    os.makedirs(CACHE_DIR, exist_ok=True)

    X, y = [], []
    print("🔄 Extracting embeddings (this will take a while)...")

    labels = sorted([
        l for l in os.listdir(DATA_DIR)
        if os.path.isdir(os.path.join(DATA_DIR, l))
    ])

    for label in labels:
        # Skip if this class is already cached
        class_cache = os.path.join(CACHE_DIR, f"cls_{label}.npy")
        if os.path.exists(class_cache):
            data = np.load(class_cache, allow_pickle=True).item()
            X.extend(data["X"])
            y.extend(data["y"])
            print(f"[{label}] — loaded from cache ({len(data['X'])} embeddings)")
            continue

        folder = os.path.join(DATA_DIR, label)
        files = [
            f for f in os.listdir(folder)
            if os.path.splitext(f)[1].lower() in IMAGE_EXTS
        ]
        print(f"\n[{label}] — {len(files)} images")

        class_X, class_y = [], []
        for file in files:
            path = os.path.join(folder, file)
            try:
                emb = get_embedding(path)
                class_X.append(emb)
                class_y.append(label)
                print(f"    ✅ {file}")
            except Exception as e:
                print(f"    ❌ {file}: {e}")

        # Save this class immediately after processing
        np.save(class_cache, {"X": class_X, "y": class_y})
        print(f"    💾 Cached {label} ({len(class_X)} embeddings)")

        X.extend(class_X)
        y.extend(class_y)

    X = np.array(X)
    y = np.array(y)

    # Save final combined cache
    np.save(EMB_PATH, X)
    np.save(LABEL_PATH, y)
    print(f"\n✅ Embeddings cached: {X.shape}")
    return X, y


def load_embeddings():
    print("📦 Loading cached embeddings...")
    X = np.load(EMB_PATH)
    y = np.load(LABEL_PATH)
    print(f"✅ Loaded: {X.shape}")
    return X, y


if os.path.exists(EMB_PATH) and os.path.exists(LABEL_PATH):
    X, y_raw = load_embeddings()
else:
    X, y_raw = extract_embeddings()

# ── Step 2: Encode labels and split ──────────────────────────────────────────
le = LabelEncoder()
y_enc = le.fit_transform(y_raw)

print(f"\n✅ Classes ({len(le.classes_)}): {list(le.classes_)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
)

# Class weights for imbalanced dataset
weights = compute_class_weight("balanced", classes=np.unique(y_train), y=y_train)
class_weight_dict = dict(enumerate(weights))

os.makedirs(os.path.dirname(LR_PATH), exist_ok=True)

# Save label encoder (shared by both models)
joblib.dump(le, LE_PATH)
print(f"✅ Label encoder saved: {LE_PATH}")

# ── Step 3: Train Logistic Regression ────────────────────────────────────────
print("\n" + "="*50)
print("Training Logistic Regression...")
print("="*50)

lr_weights = {i: class_weight_dict[i] for i in range(len(le.classes_))}
lr = LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight="balanced"
)
lr.fit(X_train, y_train)

lr_train_acc = lr.score(X_train, y_train)
lr_test_acc  = lr.score(X_test, y_test)
print(f"\nLR Train: {lr_train_acc:.2%}")
print(f"LR Test:  {lr_test_acc:.2%}")

print("\nLR Per-class report:")
print(classification_report(y_test, lr.predict(X_test), target_names=le.classes_))

joblib.dump((lr, le), LR_PATH)
print(f"✅ LR saved: {LR_PATH}")

# ── Step 3b: Train Random Forest ────────────────────────────────────────────
from sklearn.ensemble import RandomForestClassifier

print("\n" + "="*50)
print("Training Random Forest...")
print("="*50)


rf = RandomForestClassifier(
    n_estimators=200,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

rf_train_acc = rf.score(X_train, y_train)
rf_test_acc  = rf.score(X_test, y_test)
print(f"\nRF Train: {rf_train_acc:.2%}")
print(f"RF Test:  {rf_test_acc:.2%}")

print("\nRF Per-class report:")
print(classification_report(y_test, rf.predict(X_test), target_names=le.classes_))

joblib.dump((rf, le), RF_PATH)
print(f"✅ RF saved: {RF_PATH}")

# ── Step 4: Train MLP ─────────────────────────────────────────────────────────
print("\n" + "="*50)
print("Training MLP...")
print("="*50)

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Input
from tensorflow.keras.callbacks import EarlyStopping

num_classes = len(le.classes_)

y_train_cat = tf.keras.utils.to_categorical(y_train, num_classes)
y_test_cat  = tf.keras.utils.to_categorical(y_test,  num_classes)

mlp = Sequential([
    Input(shape=(X.shape[1],)),
    Dense(512, activation="relu"),
    Dropout(0.3),
    Dense(256, activation="relu"),
    Dropout(0.3),
    Dense(num_classes, activation="softmax")
])

mlp.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

mlp.fit(
    X_train, y_train_cat,
    validation_data=(X_test, y_test_cat),
    epochs=50,
    batch_size=32,
    class_weight=class_weight_dict,
    callbacks=[early_stop],
    verbose=1
)

mlp_proba    = mlp.predict(X_test, verbose=0)
mlp_preds    = np.argmax(mlp_proba, axis=1)
mlp_test_acc = np.mean(mlp_preds == y_test)
print(f"\nMLP Test: {mlp_test_acc:.2%}")

print("\nMLP Per-class report:")
print(classification_report(y_test, mlp_preds, target_names=le.classes_))

mlp.save(MLP_PATH)
print(f"✅ MLP saved: {MLP_PATH}")

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n" + "="*50)
print("SUMMARY")
print("="*50)
print(f"LR  Test Accuracy: {lr_test_acc:.2%}")
print(f"RF  Test Accuracy: {rf_test_acc:.2%}")
print(f"MLP Test Accuracy: {mlp_test_acc:.2%}")
best_acc = max(lr_test_acc, rf_test_acc, mlp_test_acc)
winner = "LR" if best_acc == lr_test_acc else "RF" if best_acc == rf_test_acc else "MLP"
print(f"Winner: {winner}")
