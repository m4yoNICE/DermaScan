import os
import numpy as np
import tensorflow as tf
from huggingface_hub import snapshot_download
import sys
from PIL import Image

# Add preprocessing to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from preprocessing.preprocess_image import (
    preprocess_for_derm_foundation,
    image_to_png_bytes,
    ImagePreprocessingError
)

CACHE_DIR = os.path.expanduser("~/.cache/huggingface")

# Download / load DermFoundation model
model_dir = snapshot_download(
    repo_id="google/derm-foundation",
    cache_dir=CACHE_DIR
)

model = tf.saved_model.load(model_dir)
infer = model.signatures["serving_default"]


def _prepare_image(image_data):
    """
    Accepts either:
    - raw image bytes
    - numpy array image (YOLO crop)
    """

    if isinstance(image_data, np.ndarray):
        img = Image.fromarray(image_data.astype("uint8"))
        img = img.convert("RGB")
        img = img.resize((448, 448))
    else:
        img = preprocess_for_derm_foundation(image_data)

    return image_to_png_bytes(img)


def get_embedding(image_data):
    try:
        png_bytes = _prepare_image(image_data)

        example = tf.train.Example(
            features=tf.train.Features(
                feature={
                    "image/encoded": tf.train.Feature(
                        bytes_list=tf.train.BytesList(value=[png_bytes])
                    )
                }
            )
        ).SerializeToString()

        output = infer(inputs=tf.constant([example]))

        return output["embedding"].numpy().flatten()

    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {str(e)}")