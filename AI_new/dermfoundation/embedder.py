import os
import sys
import tensorflow as tf
from huggingface_hub import snapshot_download

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from preprocessing.preprocess_image import (
    preprocess_for_derm_foundation,
    image_to_png_bytes,
    ImagePreprocessingError,
)

CACHE_DIR = os.path.expanduser("~/.cache/huggingface")
model_dir = snapshot_download(repo_id="google/derm-foundation", cache_dir=CACHE_DIR)
model     = tf.saved_model.load(model_dir)
infer     = model.signatures["serving_default"]


def get_embedding(image_data, apply_segmentation: bool = False):
    """
    image_data: bytes or file path string
    apply_segmentation: if True, runs skin segmentation before embedding
    """
    try:
        img = preprocess_for_derm_foundation(
            image_data,
            apply_segmentation=apply_segmentation
        )

        png_bytes = image_to_png_bytes(img)

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