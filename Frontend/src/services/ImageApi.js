import { Http } from "./Http";

const uploadImageAPI = async (uri) => {
  console.log("URI IN API: ", uri);
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: filename,
  });
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
};

const ImageApi = { uploadImageAPI };
export default ImageApi;
