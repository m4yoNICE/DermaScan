import { Http } from "./Http";

function formDataContainter(uri) {
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: filename,
  });
  return formData;
}

const ImageApi = {
  uploadSkinImageAPI: async (uri) => {
    const formData = formDataContainter(uri);
    console.log("ImageAPI: ", formData);
    return Http.post("/api/condition/skin", formData);
  },
};

export default ImageApi;
