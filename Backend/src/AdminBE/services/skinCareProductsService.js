import { db } from "../../config/db.js";
import { skinCareProducts } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export const getAllProducts = async () => {
  return await db.select().from(skinCareProducts);
};

export const getProductById = async (id) => {
  const result = await db
    .select()
    .from(skinCareProducts)
    .where(eq(skinCareProducts.id, id));
  return result[0] || null;
};

export const createProduct = async (data) => {
  const result = await db.insert(skinCareProducts).values(data);
  return result;
};

export const updateProduct = async (id, data) => {
  const result = await db
    .update(skinCareProducts)
    .set(data)
    .where(eq(skinCareProducts.id, id));

  return result;
};

export const deleteProduct = async (id) => {
  const result = await db
    .delete(skinCareProducts)
    .where(eq(skinCareProducts.id, id));

  return result;
};
