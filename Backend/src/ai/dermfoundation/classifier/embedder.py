import os
import tensorflow as tf
from huggingface_hub import snapshot_download
from PIL import Image
from io import BytesIO
import numpy as np

# print("Loading Derm Foundation model...")
model_dir = snapshot_download(repo_id="google/derm-foundation")
model = tf.saved_model.load(model_dir)
infer = model.signatures["serving_default"]
# print("Model loaded successfully.")

def get_embedding(image_data):
    # Check if it's bytes or a file path
    if isinstance(image_data, bytes):
        img = Image.open(BytesIO(image_data)).convert("RGB").resize((448, 448))
    else:
        # It's a file path (for training)
        img = Image.open(image_data).convert("RGB").resize((448, 448))
    
    buf = BytesIO()
    img.save(buf, format="PNG")
    example = tf.train.Example(
        features=tf.train.Features(
            feature={
                "image/encoded": tf.train.Feature(
                    bytes_list=tf.train.BytesList(value=[buf.getvalue()])
                )
            }
        )
    ).SerializeToString()
    output = infer(inputs=tf.constant([example]))
    return output["embedding"].numpy().flatten()