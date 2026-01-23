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


# Load model ONCE at startup
print("Loading EfficientNet-B0 model...")
base_model = EfficientNetB0(
    weights='imagenet',
    include_top=False,  
    pooling='avg'      
)
base_model.trainable = False  # Freeze weights (we're just extracting features)
print("✅ EfficientNet-B0 loaded")

def get_embedding(image_data):
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