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
  const { conditionIds, ...productData } = data;
  const result = await db.insert(skinCareProducts).values(productData);
  const insertId = result[0].insertId;
  const [product] = await db
    .select()
    .from(skinCareProducts)
    .where(eq(skinCareProducts.id, insertId));
  return product;
};

export const updateProduct = async (id, data) => {
  const { conditionIds, ...productData } = data;
  await db
    .update(skinCareProducts)
    .set(productData)
    .where(eq(skinCareProducts.id, id));
  const [product] = await db
    .select()
    .from(skinCareProducts)
    .where(eq(skinCareProducts.id, id));
  return product;
};

export const deleteProduct = async (id) => {
  return await db.delete(skinCareProducts).where(eq(skinCareProducts.id, id));
};