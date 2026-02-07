import { db } from "../config/db.js";
import { users, skinData } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

//update User
export async function updateUser(
  userId,
  firstname,
  lastname,
  birthdate,
  currentPassword,
  newPassword,
) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return { success: false, message: "User not found" };

  const data = {};
  if (firstname) data.first_name = firstname;
  if (lastname) data.last_name = lastname;
  if (birthdate) data.birthdate = birthdate;

  if (newPassword) {
    if (!currentPassword)
      return { success: false, message: "Current password required" };
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return { success: false, message: "Incorrect current password" };
    data.password = await bcrypt.hash(newPassword, 10);
  }

  await db.update(users).set(data).where(eq(users.id, userId));
  return { success: true };
}

export async function deleteUser(userId) {
  const result = await db.delete(users).where(eq(users.id, userId));
  return result.affectedRows > 0;
}

<<<<<<< HEAD
export async function getUserId(id) {
  return await db.query.users.findFirst({ where: eq(users.id, userId) });
=======
export async function getUserWithSkinData(userId) {
  const result = await db
    .select({
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      skinType: skinData.skinType,
      skinSensitivity: skinData.skinSensitivity,
      pigmentation: skinData.pigmentation,
      aging: skinData.aging,
    })
    .from(users)
    .leftJoin(skinData, eq(skinData.userId, users.id))
    .where(eq(users.id, userId));

  return result[0] || null;
>>>>>>> cdfc7df3 (-fix: implemented mini server for AI called Fast API to initialize and load model that results to 2000ms-5000ms inference time. Adjusted layout in login and register to adjust when keyboard is present. Changed Camera UI to match to Figma Design. Fixed Analysis Pipeline.)
}

export async function createSkinData(
  userId,
  skin_type,
  skin_sensitivity,
  pigmentation,
  aging,
) {
  const [inserted] = await db
    .insert(skinData)
    .values({
      userId,
      skinType: skin_type,
      skinSensitivity: skin_sensitivity,
      pigmentation,
      aging,
    })
    .$returningId();

  return await db.query.skinData.findFirst({
    where: eq(skinData.id, inserted.id),
  });
}

export async function deleteSkinData(userId) {
  const result = await db.delete(skinData).where(eq(skinData.userId, userId));
  return result.affectedRows > 0;
}
