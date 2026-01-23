import prisma from "../config/prisma.js";

export async function createStoredImage(userId, imageUrl) {
  return await prisma.storedImage.create({
    data: {
      photoUrl: imageUrl,
      user_id: userId,
    },
  });
}

export async function getImageById(image_id, user_id) {
  return await prisma.storedImage.findFirst({
    where: { id: image_id, user_id: user_id },
  });
}
