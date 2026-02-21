import { seedProducts } from "./src/drizzle/seed.js";

try {
  await seedProducts();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
