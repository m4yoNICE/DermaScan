import { storedImages } from "../drizzle/schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

export async function createStoredImage(userId, imageUrl) {
  console.log(imageUrl, userId);
  const [inserted] = await db
    .insert(storedImages)
    .values({
      photoUrl: imageUrl,
      userId: userId,
    })
    .$returningId();

  return await db.query.storedImages.findFirst({
    where: eq(storedImages.id, inserted.id),
  });
}

export async function getImageById(image_id, user_id) {
  return await db.query.storedImages.findFirst({
    where: (eq(storedImages.id, image_id), eq(storedImages.userId, user_id)),
  });
}
