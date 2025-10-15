import Stored_images from "../models/Stored_images.js";

export async function createStoreImage(userId, imageUrl) {
  return await Stored_images.create({
    photoUrl: imageUrl,
    user_id: userId,
  });
}
