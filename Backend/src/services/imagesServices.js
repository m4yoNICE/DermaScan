import StoredImage from "../models/StoredImage.js";

export async function createStoredImage(userId, imageUrl) {
  return await StoredImage.create({
    photoUrl: imageUrl,
    user_id: userId,
  });
}
