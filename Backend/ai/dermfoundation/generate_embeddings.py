import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pickle
import os
from PIL import Image
from io import BytesIO
import tensorflow as tf
from huggingface_hub import snapshot_download

# === STEP 1: Generate embeddings for ALL your training images ===
def generate_embeddings_for_dataset(image_folder, infer):
    """
    Assumes folder structure:
    image_folder/
        acne/
            img1.jpg
            img2.jpg
        melanoma/
            img1.jpg
        ...
    """
    embeddings = []
    labels = []
    
    for condition in os.listdir(image_folder):
        condition_path = os.path.join(image_folder, condition)
        if not os.path.isdir(condition_path):
            continue
            
        for img_file in os.listdir(condition_path):
            img_path = os.path.join(condition_path, img_file)
            
            # Load and preprocess image (your existing code)
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
            
            # Get embedding
            output = infer(inputs=tf.constant([example]))
            embedding = output["embedding"].numpy().flatten()
            
            embeddings.append(embedding)
            labels.append(condition)
    
    return np.array(embeddings), np.array(labels)

# === STEP 2: Train classifier ===
print("Generating embeddings for training data...")
X, y = generate_embeddings_for_dataset("path/to/your/training/images", infer)

print(f"Generated {len(X)} embeddings for {len(np.unique(y))} conditions")

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train classifier
print("Training classifier...")
classifier = LogisticRegression(max_iter=1000, multi_class='multinomial')
classifier.fit(X_train, y_train)

# Evaluate
accuracy = classifier.score(X_test, y_test)
print(f"Test accuracy: {accuracy:.2%}")

# Save the trained classifier
with open("skin_condition_classifier.pkl", "wb") as f:
    pickle.dump(classifier, f)

print("Classifier saved.")

# Load your trained classifier
with open("skin_condition_classifier.pkl", "rb") as f:
    classifier = pickle.load(f)

# Your existing code to get embedding
output = infer(inputs=tf.constant([example]))
embedding = output["embedding"].numpy().flatten()

# NOW classify it
prediction = classifier.predict([embedding])[0]
probabilities = classifier.predict_proba([embedding])[0]

print(f"Predicted condition: {prediction}")
print(f"Confidence: {probabilities.max():.2%}")
