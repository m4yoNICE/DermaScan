### How to Run

To get started, you'll need to install the **Expo Go** app on your phone.

- [**Expo Go on Google Play**](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

### Running the Backend

**First time setup:**

```bash
cd backend
npm install                     # Install dependencies
npx prisma generate            # Generate Prisma client
npx prisma migrate dev         # Create database tables
node prisma/seed.js            # Insert default data
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
pip install scikit-learn pillow tensorflow huggingface_hub opencv-python
```

**Note:** Use `pip install tensorflow-cpu` if you don't have a GPU.

---

JasperBayot
