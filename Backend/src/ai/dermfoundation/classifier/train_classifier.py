import os
import numpy as np
import joblib
from embedder import get_embedding
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

DATA_DIR = "../data"
MODEL_PATH = "skin_classifier.pkl"
TRAINING_DATA_PATH = "training_data.npz"  # switched to NPZ


def load_existing_training_data():
    """Load NPZ training data if it exists."""
    if not os.path.exists(TRAINING_DATA_PATH):
        return None, None

    data = np.load(TRAINING_DATA_PATH)
    return data["X"], data["y"]


def save_training_data(X, y):
    """Save embeddings + labels to NPZ."""
    np.savez(TRAINING_DATA_PATH, X=X, y=y)


def load_existing_model():
    """Load classifier + label encoder if they exist."""
    if not os.path.exists(MODEL_PATH):
        return None, None
    return joblib.load(MODEL_PATH)


def collect_new_embeddings():
    """Read all images in DATA_DIR and convert them to embeddings."""
    X, y = [], []
    failed = []

    for label in os.listdir(DATA_DIR):
        folder = os.path.join(DATA_DIR, label)
        if not os.path.isdir(folder):
            continue

        for file in os.listdir(folder):
            path = os.path.join(folder, file)
            if not os.path.isfile(path):
                continue

            try:
                emb = get_embedding(path)
                X.append(emb)
                y.append(label)
                print(f"Processed {label}/{file}")
            except Exception as e:
                failed.append(f"{label}/{file}")
                print(f"❌ FAILED: {label}/{file} — {type(e).__name__}: {str(e)}")

    if not X:
        print("❌ No valid samples processed. Exiting.")
        exit(1)

    print(f"\n📊 Successfully processed {len(X)} new samples")
    if failed:
        print(f"⚠️ Failed to process {len(failed)} files:")
        for f in failed:
            print(f"   - {f}")

    return np.array(X), np.array(y)


def merge_datasets(X_old, y_old, X_new, y_new):
    """Merge old and new training data cleanly."""
    if X_old is None or y_old is None:
        return X_new, y_new  # training from scratch
    
    X = np.vstack([X_old, X_new])
    y = np.hstack([y_old, y_new])
    return X, y


def main():
    # === 1. Load new embeddings ===
    X_new, y_new = collect_new_embeddings()

    # === 2. Load existing model + data ===
    clf, le = load_existing_model()
    X_old, y_old = load_existing_training_data()

    # === 3. Merge datasets ===
    X, y = merge_datasets(X_old, y_old, X_new, y_new)

    # === 4. Update label encoder ===
    if le is None:
        le = LabelEncoder()

    # Check if new classes exist
    le.fit(y)

    # === 5. Train classifier ===
    y_enc = le.transform(y)
    print(f"\n🚀 Training classifier on {len(X)} samples...")
    
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, y_enc)

    # === 6. Save model + training data ===
    joblib.dump((clf, le), MODEL_PATH)
    save_training_data(X, y)

    print(f"\n✅ Model saved to {MODEL_PATH}")
    print(f"✅ Training data saved to {TRAINING_DATA_PATH}")
    print("🎉 Training complete.")


if __name__ == "__main__":
    main()
