# DermaCan Brainstorming Session Summary

## Context
- Capstone project, 1 month remaining, ~70% complete
- Skin condition analysis app with recommendation system
- Using Google Derm Foundation (pretrained) — 6144-dimensional embeddings, 448x448 input
- 14 classes, ~500 images per class (7000 total)
- Current classifier head: Logistic Regression
- Stack: TensorFlow, React Native/Expo frontend, Node.js backend, Python AI service

---

## Key Decisions

### 1. Multi-Label Classification — Rejected
- Original thought: switch to multi-label to handle visually similar conditions
- Why it's wrong: nodule/papule confusion is a **confidence/ambiguity problem**, not a label structure problem
- Multi-label requires co-occurrence annotated dataset — we don't have that
- Scope & Limitation write-up:

> "The system utilizes single-label classification as the acquisition of a multi-label annotated dermatological dataset of sufficient size and class balance was outside the scope of this study. Multi-label classification requires images annotated with co-occurring conditions, which demands significantly more expert clinical annotation effort and was not feasible within the project timeline."

---

### 2. Logistic Regression → MLP
- Panel from 2 months ago criticized logistic regression
- Logistic = linear boundary. MLP = non-linear boundary
- 6144 input dimensions with overlapping classes = linear boundary insufficient
- Upgrading to MLP directly addresses panel criticism with technical justification

**Defense statement for panel:**
> "The previous panel raised concerns about classification accuracy on visually similar conditions. Logistic regression assumes linear separability which is insufficient for dermatological features that share overlapping visual characteristics. We upgraded to a Multi-Layer Perceptron which learns non-linear decision boundaries, better suited for high-dimensional embedding spaces like Derm Foundation's 6144-dimensional output."

**MLP Architecture (TensorFlow):**
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

model = Sequential([
    Dense(512, activation='relu', input_shape=(6144,)),
    Dropout(0.3),
    Dense(256, activation='relu'),
    Dropout(0.3),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
```

**Early Stopping:**
```python
from tensorflow.keras.callbacks import EarlyStopping

early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
```

---

### 3. Confidence Score Thresholding (instead of multi-label)
- If model confidence < threshold (e.g. 70%), surface top-2/top-3 predictions
- Handles ambiguous cases like nodules vs papules honestly
- Mimics real dermatologist differential diagnosis thinking
- Mention this in scope & limitations as the design decision replacing multi-label

---

### 4. Dataset — Augmentation Needed
- 7000 images across 14 classes is tight for MLP on 6144-dim input
- Risk: overfitting
- Fix: augment (flip, rotate, brightness, zoom) via Keras `ImageDataGenerator`
- Dropout already in architecture helps

---

### 5. Algorithm Comparison Chart (LEGITIMATE version)
- Train multiple classifiers on same Derm Foundation embeddings
- Test on same test set
- Plot real metrics — do NOT fabricate numbers

**Training multiple models:**
```python
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'SVM': SVC(kernel='rbf', probability=True),
    'Random Forest': RandomForestClassifier(n_estimators=100),
    # MLP trained separately via TensorFlow
}
```

**Plotting the comparison chart:**
```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Replace values below with ACTUAL test results
results = {
    'Model': ['Logistic Regression', 'SVM', 'Random Forest', 'MLP'],
    'Accuracy': [0.78, 0.81, 0.79, 0.85],
    'F1 Score': [0.76, 0.80, 0.77, 0.84],
    'Precision': [0.75, 0.79, 0.76, 0.83],
    'Recall': [0.77, 0.81, 0.78, 0.85]
}

df = pd.DataFrame(results)
df_melted = df.melt(id_vars='Model', var_name='Metric', value_name='Score')

plt.figure(figsize=(10, 6))
sns.barplot(data=df_melted, x='Model', y='Score', hue='Metric')
plt.title('Algorithm Comparison - DermaCan Classifier Heads')
plt.ylim(0, 1)
plt.tight_layout()
plt.savefig('algorithm_comparison.png', dpi=300)
plt.show()
```

---

## Next Steps (Pending)
- [ ] List all 14 skin condition classes
- [ ] Identify which classes can be **merged** (same visual appearance + same treatment = same class, fewer boundaries, better accuracy)
- [ ] Run augmentation pipeline
- [ ] Train all 4 models on same embeddings
- [ ] Get real accuracy/F1/precision/recall per model
- [ ] Build comparison chart with real numbers
- [ ] Implement confidence thresholding in recommendation output

---

## Open Question
**What are the 14 classes?** — Critical for determining merge candidates and estimating realistic final accuracy.
