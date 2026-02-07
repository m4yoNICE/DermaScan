import { Http } from "./Http";

<<<<<<< HEAD
const uploadImageAPI = async (uri) => {
  console.log("URI IN API: ", uri);
=======
function createImageFormData(uri, fieldName = "image") {
>>>>>>> cdfc7df3 (-fix: implemented mini server for AI called Fast API to initialize and load model that results to 2000ms-5000ms inference time. Adjusted layout in login and register to adjust when keyboard is present. Changed Camera UI to match to Figma Design. Fixed Analysis Pipeline.)
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append(fieldName, {
    uri,
    type: "image/jpeg",
    name: filename,
  });
<<<<<<< HEAD
  console.log("FORMDATA: ", formData);
  try {
    const response = await Http.post("/images/skin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("SUCCESS:", response.data);
    return response;
  } catch (err) {
    console.log(err);
  }
=======
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
>>>>>>> cdfc7df3 (-fix: implemented mini server for AI called Fast API to initialize and load model that results to 2000ms-5000ms inference time. Adjusted layout in login and register to adjust when keyboard is present. Changed Camera UI to match to Figma Design. Fixed Analysis Pipeline.)
};

const ImageApi = { uploadImageAPI };
export default ImageApi;
