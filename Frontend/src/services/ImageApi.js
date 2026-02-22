import { Http } from "./Http";

function createImageFormData(uri, fieldName = "image") {
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append(fieldName, {
    uri,
    type: "image/jpeg",
    name: filename,
  });
  return formData;
}

async function uploadImage(endpoint, uri, fieldName = "image") {
  const formData = createImageFormData(uri, fieldName);

  try {
    const response = await Http.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

const ImageApi = {
  uploadSkinImageAPI: (uri) => uploadImage("/api/condition/skin", uri),
  uploadProfilePicAPI: (uri) => uploadImage("/api/profile/pic", uri),
};

export default ImageApi;
