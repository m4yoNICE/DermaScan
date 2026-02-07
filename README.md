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

### Database Migrations (Backend)

**Create new migration:**

```bash
npx prisma migrate dev --name your-migration-name
```

**Reset database (WARNING: deletes all data):**

```bash
npx prisma migrate reset
```

**Check migration status:**

```bash
npx prisma migrate status
```

**Seed database:**

```bash
node prisma/seed.js
```

**Generate Prisma client (after schema changes):**

```bash
npx prisma generate
```

**View database in GUI:**

```bash
npx prisma studio
```

---

### Python Setup (for AI/ML features)

Login to Hugging Face (if using models from HF):

```bash
huggingface-cli login
```

Download required Python packages:

```bash
pip install scikit-learn pillow tensorflow huggingface_hub opencv-python fastapi uvicorn joblib numpy
```

**Note:** Use `pip install tensorflow-cpu` if you don't have a GPU.

---

JasperBayot
