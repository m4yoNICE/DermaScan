# DermaScan+
### A Mobile Skin Condition Detection and Personalized Skincare Recommender System for Young Adults

DermaScan+ is a capstone research project that uses AI to detect skin conditions from photos and recommend personalized skincare routines. It combines Google's Derm Foundation as a frozen feature extractor with Logistic Regression classifier heads in a two-stage pipeline — first classifying the skin condition, then assessing severity.

> **Disclaimer**: This is an academic research project and is not intended for clinical or commercial use. Predictions are not a substitute for professional medical diagnosis. Always consult a licensed dermatologist for accurate skin condition assessment.

---

## Key Features

- AI-powered skin condition detection from camera or gallery photos
- Two-stage classification: condition → severity
- Personalized skincare product recommendations based on skin type and detected condition
- Morning and evening routine scheduling with push notifications
- Journal with mood tracking
- Skin history with analysis logs
- Admin dashboard for managing products, users, and analysis data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo) |
| Backend API | Node.js, Express.js |
| AI Inference Server | Python, FastAPI |
| Admin Dashboard | React (Vite) |
| Database | MySQL (via Drizzle ORM) |
| Image Storage | ImageKit |
| ML Model | Google Derm Foundation + Logistic Regression |

---

## System Architecture

```
Mobile App (React Native)
        │
        ▼
Backend API (Express.js) ──────► AI Inference Server (FastAPI)
        │                                │
        ▼                                ▼
    MySQL DB                  Derm Foundation Embeddings
                                   + LR Classifiers
```

---

## ML Model

Two-stage pipeline:

- **Stage 1** — Skin condition classification (14 classes, 96.17% accuracy)
- **Stage 2** — Severity classification per condition (mild / moderate / severe)

Google's Derm Foundation serves as a frozen feature extractor generating 6144-dimensional embeddings. Logistic Regression classifier heads are trained on top.

Conditions in scope: acne blackheads, acne fungal, acne papules/pustules (inflammatory), acne whiteheads, acne cyst/nodules (severe), eczema, enlarged pores, melasma, milia, post-inflammatory erythema, post-inflammatory hyperpigmentation.

## AI Inference Server

Deployed on Hugging Face Spaces via Docker.

- `POST /analyze` — accepts raw image bytes, returns skin condition prediction and severity
- `GET /health` — health check

Built with FastAPI. Uses Google's Derm Foundation as a frozen feature extractor.

- [Derm Foundation](https://developers.google.com/health-ai-developer-foundations/derm-foundation)
- [HuggingFace Model](https://huggingface.co/google/derm-foundation)


### File structure

- `embedder.py` — loads Derm Foundation and generates embeddings
- `twophase_server.py` — FastAPI inference server
- `preprocessing/preprocess_image.py` — resizes and normalizes images to RGB 448×448
- `trained_data_two_stage/` — trained Logistic Regression classifier heads (.pkl files)

---

## Project Structure

```
DermaScan/
├── Frontend/       # React Native mobile app (Expo)
├── Backend/        # Express.js API server
├── AI/             # FastAPI inference server + trained models
├── Admin/          # React admin dashboard
└── apk-page/       # React landing page for APK download
```

---

## Setup & Installation

### Prerequisites

- Node.js
- Python 3.11+
- Expo CLI
- MySQL database

---

### Backend

```bash
cd Backend
npm install

# Copy and configure environment variables
cp .env.example .env

# Push database schema
npx drizzle-kit push

# Seed the database
node src/drizzle/unmerge_seed.js

# Start the server
npm run dev
```

---

### AI Inference Server

```bash
cd AI

# Install dependencies
pip install scikit-learn pillow tensorflow huggingface_hub opencv-python fastapi uvicorn joblib numpy

# Note: use tensorflow-cpu if no GPU
pip install tensorflow-cpu

# Login to Hugging Face (required for Derm Foundation)
huggingface-cli login

# Start the server
python twophase_server.py
```

> **Windows only**: If you get an execution policy error, run this first:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

---

### Mobile App (Frontend)

```bash
cd Frontend
npm install
npx expo start
```

Scan the QR code with the Expo Go app, or install the APK directly from the [DermaScan+ landing page](https://dermascan-landing.vercel.app).

---

### Admin Dashboard

```bash
cd Admin
npm install
npm run dev
```

---

## Deployment

| Service | Platform |
|---|---|
| Backend API | Railway |
| AI Inference Server | Hugging Face Spaces (Docker) |
| Admin Dashboard | Vercel |
| APK Landing Page | Vercel |

---

## Known Limitations

- Some class confusion between visually similar conditions
- Dataset limitations due to data being sourced and aggregated from multiple platforms (Roboflow, ISIC, Kaggle, and others), resulting in inconsistent distribution across conditions
- Psoriasis is excluded from scope per dermatologist consultation
- Cold start on Hugging Face Spaces may cause initial delay on first inference request

---

## Developers

Developed as a capstone project by students of the University of Cebu Lapu-lapu and Mandaue

---

## License

For academic use only.