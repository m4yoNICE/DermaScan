### How to Run

To get started, you'll need to install the **Expo Go** app on your phone.

- [**Expo Go on Google Play**](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

### Running the Backend

**First time setup:**

```bash
cd backend
npm install                         # if first time using it
npx sequelize-cli db:migrate      # Create database tables
npx sequelize-cli db:seed:all     # Insert default data
```

**Start the server:**

```bash
npm run dev
```

### Running the Frontend

In frontend directory:

```bash
npm install                     # if first time using it
npx expo start
```

Open the Expo Go app and scan the QR code in the terminal

---

### Database Migrations (Backend)

**Create new migration:**

```bash
npx sequelize-cli migration:generate --name your-migration-name
# Edit the generated .cjs file in src/migrations/, then run:
npx sequelize-cli db:migrate
```

**Rollback last migration:**

```bash
npx sequelize-cli db:migrate:undo
```

**Check migration status:**

```bash
npx sequelize-cli db:migrate:status
```

**Seed All Databases**

```bash
npx sequelize-cli db:seed:all
```

**Undo Seeding All Databases**

```bash
npx sequelize-cli db:seed:undo:all
```

**Important:** Never use `db.sync()`. All migrations must use `.cjs` extension. Since package.json uses ` "type": "module"` but Sequelize doesnt support it

Login to Hugging Face (if using models from HF):

```bash
hf auth login
```

Download packages from python
```bash

pip install scikit-learn
pip install pillow
pip install tensorflow
pip install huggingface_hub
pip install opencv-python
```
