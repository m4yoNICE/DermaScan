import StoredImage from "../models/StoredImage.js";

export async function createStoreImage(userId, imageUrl) {
  return await StoredImage.create({
    photoUrl: imageUrl,
    user_id: userId,
  });
}
