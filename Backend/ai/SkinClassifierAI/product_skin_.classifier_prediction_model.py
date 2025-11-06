import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
from datetime import datetime
from PIL import Image
from io import BytesIO
import tensorflow as tf
import pandas as pd  # 🆕 for CSV/XLS export

# === STEP 1: Define your infer function ===
def infer(inputs):
    embeddings = []
    for example_bytes in inputs:
        example = tf.train.Example()
        example.ParseFromString(example_bytes.numpy())
        image_raw = example.features.feature["image/encoded"].bytes_list.value[0]
        img = tf.image.decode_png(image_raw, channels=3)
        img = tf.image.resize(img, (224, 224))
        img = tf.expand_dims(img, 0)
        emb = tf.random.uniform((1, 128))  # Dummy embedding — replace with real model output
        embeddings.append(emb)
    return {"embedding": tf.concat(embeddings, axis=0)}

# === STEP 2: Generate embeddings from your dataset ===
def generate_embeddings_for_dataset(image_folder, infer):
    embeddings = []
    labels = []
    filenames = []

    for condition in os.listdir(image_folder):
        condition_path = os.path.join(image_folder, condition)
        if not os.path.isdir(condition_path):
            continue
        for img_file in os.listdir(condition_path):
            img_path = os.path.join(condition_path, img_file)
            img = Image.open(img_path)
            buf = BytesIO()
            img.convert("RGB").save(buf, "PNG")
            image_bytes = buf.getvalue()

            example = tf.train.Example(
                features=tf.train.Features(
                    feature={
                        "image/encoded": tf.train.Feature(
                            bytes_list=tf.train.BytesList(value=[image_bytes])
                        )
                    }
                )
            ).SerializeToString()

            output = infer(inputs=tf.constant([example]))
            embedding = output["embedding"].numpy().flatten()

            embeddings.append(embedding)
            labels.append(condition)
            filenames.append(img_file)

    return np.array(embeddings), np.array(labels), np.array(filenames)

# === STEP 3: Train classifier ===
script_dir = os.path.dirname(os.path.abspath(__file__))
image_folder = os.path.abspath(os.path.join(script_dir, "../../productData"))

print("Resolved path:", image_folder)
print("Exists?", os.path.exists(image_folder))
print("Contents:", os.listdir(image_folder))

X, y, filenames = generate_embeddings_for_dataset(image_folder, infer)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

classifier = LogisticRegression(max_iter=1000, multi_class="multinomial")
classifier.fit(X_train, y_train)

accuracy = classifier.score(X_test, y_test)
print(f"✅ Classifier trained with test accuracy: {accuracy:.2%}")

# === STEP 4: Save embeddings + classifier cache ===
cache = {
    "embeddings": X,
    "labels": y,
    "classifier": classifier
}

filename_pkl = f"skin_cache_{datetime.now().strftime('%Y-%m-%d_%H-%M')}.pkl"
joblib.dump(cache, filename_pkl)
print(f"✅ Cache + classifier saved as {filename_pkl}")

# === STEP 5: Export readable CSV/XLS ===
timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
csv_filename = f"embeddings_{timestamp}.csv"
xls_filename = f"embeddings_{timestamp}.xlsx"

# Combine data for human readability
df = pd.DataFrame(X)
df.insert(0, "Label", y)
df.insert(1, "Filename", filenames)

# Save both CSV and Excel
df.to_csv(csv_filename, index=False)
df.to_excel(xls_filename, index=False)

print(f"✅ Embeddings exported as {csv_filename} and {xls_filename}")