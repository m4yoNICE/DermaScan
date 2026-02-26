import { Http } from "@/services/Http";

export async function FormsData(endpoint, uri, fieldName = "image") {
  const formData = DataForms(uri, fieldName);

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

const DataForms = (uri, fieldName = "image") => {
  const filename = uri.split("/").pop() || "image.jpg";
  const formData = new FormData();
  formData.append(fieldName, {
    uri,
    type: "image/jpeg",
    name: filename,
  });
  return formData;
};
