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
# Start the server
npm run dev     # Insert default data
```

**Start the server:**

```bash
npm run dev
```

### Running the Frontend

In frontend directory:

```bash
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
pip install scikit-learn pillow tensorflow huggingface_hub opencv-python
```

**Note:** Use `pip install tensorflow-cpu` if you don't have a GPU.

---

JasperBayot
