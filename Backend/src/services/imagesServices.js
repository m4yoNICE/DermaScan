import StoredImage from "../models/StoredImage.js";

export async function createStoredImage(userId, imageUrl) {
  return await StoredImage.create({
    photoUrl: imageUrl,
    user_id: userId,
  });
}

export async function getImageById(image_id, user_id) {
  return await StoredImage.findOne({
    where: { id: image_id, user_id: user_id },
  });
}
