### How to Run

To get started, you'll need to install the **Expo Go** app on your phone.

- [**Expo Go on Google Play**](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

### Running the Backend

**First time setup:**

```bash
# Navigate to backend
cd Backend
npm install

# Setup environment variables (copy and edit with your DB credentials)
cp .env.example .env

# Push database schema
npx drizzle-kit push
# Seed the database
node src/drizzle/seed.js
```

**Start the servers:**

Terminal 1 - Python AI Server:

```bash
cd AI/dermfoundation
python server.py
```

Terminal 2 - Node Backend:

```bash
cd Backend
npm run dev
```

---

### Running the Frontend

In frontend directory:

```bash
cd Frontend
npm install                     # Install dependencies
npx expo start
```

Open the Expo Go app and scan the QR code in the terminal

---

### Python Setup (for AI/ML features)

Login to Hugging Face (if using models from HF):

```bash
huggingface-cli login
```

Download required Python packages:

```bash
pip install scikit-learn pillow tensorflow huggingface_hub opencv-python fastapi uvicorn joblib numpy ultralytics
```

**Note:** Use `pip install tensorflow-cpu` if you don't have a GPU.

---

### Skin Lesion YOLO Model (optional)

The analysis pipeline uses YOLO for lesion detection. Use one of these options:

**Option A – Pre-trained skin model (recommended):**
```bash
cd AI
python download_skin_yolo.py
```
Downloads `skin_yolov8n_seg.pt` from Hugging Face (trained on skin lesion data).

**Option B – Train your own on ISIC/HAM10000:**
```bash
cd AI
pip install requests
python train_skin_yolo.py
```
Downloads the dataset from Hugging Face and trains YOLOv8. Then copy the best weights:
```bash
copy AI\runs\detect\skin_lesion\weights\best.pt AI\skin_yolov8n_seg.pt
```

**Option C – Use default COCO model:**
If no skin model is present, the server falls back to `yolov8n.pt` (general object detection).

---

JasperBayot
