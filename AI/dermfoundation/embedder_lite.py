import os
import tensorflow as tf
from PIL import Image
import numpy as np
import sys

# Add preprocessing to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from preprocessing.preprocess_image import (
    preprocess_to_array,
    ImagePreprocessingError
)

# Load TFLite model ONCE at startup
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TFLITE_PATH = os.path.join(SCRIPT_DIR, "derm_foundation_fp16.tflite")

print("Loading TFLite model...")
interpreter = tf.lite.Interpreter(model_path=TFLITE_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print(f"✅ TFLite model loaded from {TFLITE_PATH}")

def get_embedding(image_data):
    try:
        # Preprocess to numpy array (normalized, with batch dimension)
        img_array = preprocess_to_array(
            image_data,
            normalize=True,  # Normalize to [0, 1]
            add_batch_dim=True
        )
        
        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], img_array)
        
        # Run inference
        interpreter.invoke()
        
        # Get output
        embedding = interpreter.get_tensor(output_details[0]['index'])
        
        return embedding.flatten()
        
    except ImagePreprocessingError:
        raise
    except Exception as e:
        raise RuntimeError(f"TFLite embedding generation failed: {str(e)}")