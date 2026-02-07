import { Http } from "./Http";

const uploadImageAPI = async (uri) => {
  console.log("URI IN API: ", uri);
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append(fieldName, {
    uri,
    type: "image/jpeg",
    name: filename,
  });
  return formData;
}

const ImageApi = {
  uploadSkinImageAPI: async (uri) => {
    const formData = formDataContainter(uri);
    return Http.post("/api/condition/skin", formData);
  },
};

export default ImageApi;
