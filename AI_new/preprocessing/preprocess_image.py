from PIL import Image, UnidentifiedImageError
from io import BytesIO
import sys, os
import numpy as np
from typing import Union, Tuple

# Configuration
TARGET_SIZE             = (448, 448)
TARGET_SIZE_DERM        = (448, 448)
TARGET_SIZE_EFFICIENTNET = (224, 224)

MAX_IMAGE_SIZE_MB = 10
MAX_IMAGE_BYTES   = MAX_IMAGE_SIZE_MB * 1024 * 1024


class ImagePreprocessingError(Exception):
    pass


def validate_image_data(image_data: bytes):
    if len(image_data) > MAX_IMAGE_BYTES:
        raise ImagePreprocessingError(
            f"Image exceeds {MAX_IMAGE_SIZE_MB}MB limit "
            f"({len(image_data) / (1024**2):.1f}MB)"
        )
    if len(image_data) == 0:
        raise ImagePreprocessingError("Empty image data")


def load_image(image_data: Union[bytes, str]) -> Image.Image:
    try:
        if isinstance(image_data, bytes):
            validate_image_data(image_data)
            img = Image.open(BytesIO(image_data))
        else:
            img = Image.open(image_data)

        img.verify()  # validates without fully decoding

        # Reopen — verify() closes the stream
        if isinstance(image_data, bytes):
            img = Image.open(BytesIO(image_data))
        else:
            img = Image.open(image_data)

        return img

    except UnidentifiedImageError:
        raise ImagePreprocessingError("Invalid or corrupted image format")
    except FileNotFoundError:
        raise ImagePreprocessingError(f"Image file not found: {image_data}")
    except Exception as e:
        raise ImagePreprocessingError(f"Failed to load image: {str(e)}")


def preprocess_for_derm_foundation(
    image_data: Union[bytes, str],
    target_size: Tuple[int, int] = TARGET_SIZE_DERM,
    apply_segmentation: bool = False        # ← toggle here
) -> Image.Image:
    try:
        img = load_image(image_data)
        img = img.convert("RGB")

        # Optional segmentation — runs BEFORE resize so Derm Foundation
        # receives the cropped skin region scaled to 448x448
        if apply_segmentation:
            import sys, os
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from segment import segment_pil_image
            img = segment_pil_image(img)

        img = img.resize(target_size, Image.LANCZOS)
        return img

    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise ImagePreprocessingError(f"Preprocessing failed: {str(e)}")


def preprocess_for_efficientnet(
    image_data: Union[bytes, str],
    target_size: Tuple[int, int] = TARGET_SIZE_EFFICIENTNET
) -> Image.Image:
    try:
        img = load_image(image_data)
        img = img.convert("RGB")
        img = img.resize(target_size, Image.LANCZOS)
        return img
    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise ImagePreprocessingError(f"Preprocessing failed: {str(e)}")


def image_to_array(img: Image.Image, normalize: bool = False) -> np.ndarray:
    arr = np.array(img, dtype=np.float32)
    if normalize:
        arr = arr / 255.0
    return arr


def preprocess_to_array(
    image_data: Union[bytes, str],
    normalize: bool = False,
    add_batch_dim: bool = False,
    apply_segmentation: bool = False
) -> np.ndarray:
    img = preprocess_for_derm_foundation(
        image_data,
        apply_segmentation=apply_segmentation
    )
    arr = image_to_array(img, normalize=normalize)
    if add_batch_dim:
        arr = np.expand_dims(arr, axis=0)
    return arr


def preprocess_to_array_efficientnet(
    image_data: Union[bytes, str],
    add_batch_dim: bool = True
) -> np.ndarray:
    try:
        img = load_image(image_data)
        img = img.convert("RGB")
        img = img.resize(TARGET_SIZE_EFFICIENTNET, Image.LANCZOS)
        arr = np.array(img, dtype=np.float32)
        if add_batch_dim:
            arr = np.expand_dims(arr, axis=0)
        return arr
    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise ImagePreprocessingError(f"EfficientNet preprocessing failed: {str(e)}")


def image_to_png_bytes(img: Image.Image) -> bytes:
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# Backward compat
def preprocess_image(image_data: Union[bytes, str]) -> Image.Image:
    return preprocess_for_derm_foundation(image_data)