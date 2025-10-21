import tensorflow as tf
import numpy as np
from huggingface_hub import snapshot_download
from PIL import Image
from io import BytesIO
import os

# For training classifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# === Label mapping (example classes) ===
label_map = ["acne", "eczema", "psoriasis", "melanoma", "normal_skin"]

# === Load Derm Foundation ===
print("Loading Derm Foundation model...")
model_dir = snapshot_download(repo_id="google/derm-foundation")
model = tf.saved_model.load(model_dir)
infer = model.signatures["serving_default"]
print("✅ Derm Foundation model loaded!")

# === Prepare dataset ===
base_dir = "./data"
X, y = [], []

print("\n📂 Scanning dataset folders...")

for label in label_map:
    folder = os.path.join(base_dir, label)
    if not os.path.exists(folder):
        print(f"⚠️  Folder not found: {folder}")
        continue

    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png", ".jpeg"))]
    print(f"🧠 {label}: found {len(files)} images")

    for file in files:
        img_path = os.path.join(folder, file)
        try:
            img = Image.open(img_path).convert("RGB")
            buf = BytesIO()
            img.save(buf, "PNG")
            example = tf.train.Example(
                features=tf.train.Features(
                    feature={"image/encoded": tf.train.Feature(bytes_list=tf.train.BytesList(value=[buf.getvalue()]))}
                )
            ).SerializeToString()

            output = infer(inputs=tf.constant([example]))
            embedding = output["embedding"].numpy().flatten()

            X.append(embedding)
            y.append(label)
        except Exception as e:
            print(f"❌ Failed to process {img_path}: {e}")

X = np.array(X)
y = np.array(y)

print(f"\n📊 Total samples collected: {len(X)}")

# === Check before splitting ===
if len(X) < 2:
    print("❌ Not enough data to split! You need at least 2 samples.")
    exit()

# === Split data ===
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === Train classifier ===
print("\n⚙️  Training Logistic Regression classifier...")
clf = LogisticRegression(max_iter=1000)
clf.fit(X_train, y_train)

# === Evaluate ===
print("\n📈 Evaluation Results:")
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# === Save the classifier ===
joblib.dump(clf, "skin_condition_classifier.joblib")

print("\n✅ Classifier trained and saved successfully as 'skin_condition_classifier.joblib'!")
