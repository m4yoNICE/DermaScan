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
  return Http.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

const ImageApi = {
  uploadSkinImageAPI: (uri) => uploadImage("/api/condition/skin", uri),
  uploadProfilePicAPI: (uri) => uploadImage("/api/profile/pic", uri),
  // add more as needed
};

export default ImageApi;
