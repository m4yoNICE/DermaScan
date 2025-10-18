import tensorflow as tf
import os
from huggingface_hub import snapshot_download
from PIL import Image
from io import BytesIO

# === 1. Download (or use cached) Derm Foundation model ===
print("Loading Derm Foundation model (first time takes a while)...")
model_dir = snapshot_download(repo_id="google/derm-foundation")

# Load it as a TensorFlow SavedModel (not via Keras)
loaded_model = tf.saved_model.load(model_dir)
infer = loaded_model.signatures["serving_default"]
print("Model loaded successfully.")

# === 2. Load your test image ===
image_path = "../../skinUploads"

latest_file = max(
    [os.path.join(image_path, f) for f in os.listdir(image_path)],
    key=os.path.getmtime
)

img = Image.open(latest_file)
buf = BytesIO()
img.convert("RGB").save(buf, "PNG")
image_bytes = buf.getvalue()

# === 3. Convert image to serialized TFExample ===
example = tf.train.Example(
    features=tf.train.Features(
        feature={
            "image/encoded": tf.train.Feature(
                bytes_list=tf.train.BytesList(value=[image_bytes])
            )
        }
    )
).SerializeToString()

# === 4. Run inference ===
print("Running inference...")
output = infer(inputs=tf.constant([example]))

# === 5. Extract embedding ===
embedding = output["embedding"].numpy().flatten()
print("Embedding length:", len(embedding))
print("First 10 values:", embedding[:10])
