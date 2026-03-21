import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
import sys

# Add preprocessing to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from preprocessing.preprocess_image import (
    preprocess_to_array_efficientnet,
    ImagePreprocessingError
)

# ✅ Don't load at import - initialize as None
base_model = None

def _load_model():
    """Lazy load the model on first use"""
    global base_model
    if base_model is None:
        print("Loading EfficientNet-B0 model...", file=sys.stderr)
        base_model = EfficientNetB0(
            weights='imagenet',
            include_top=False,  
            pooling='avg'      
        )
        base_model.trainable = False
        print("✅ EfficientNet-B0 loaded", file=sys.stderr)

def get_embedding(image_data):
    # ✅ Load model here (after stdin is read in predict.py)
    _load_model()
    
    try:
        img_array = preprocess_to_array_efficientnet(
            image_data,
            add_batch_dim=True
        )
        
        # EfficientNet-specific preprocessing
        img_array = preprocess_input(img_array)
        
        # Get embedding
        embedding = base_model.predict(img_array, verbose=0)
        
        return embedding.flatten()
        
    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise RuntimeError(f"EfficientNet embedding generation failed: {str(e)}")