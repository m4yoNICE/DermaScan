export function buildProductFormData(formData) {
  const data = new FormData();
  data.append("productName", formData.productName);
  data.append("ingredient", formData.ingredient);
  data.append("description", formData.description);
  data.append("productType", formData.productType);
  data.append("locality", formData.locality);
  data.append("skinType", formData.skinType);
  data.append("dermaTested", formData.dermaTested);
  data.append("timeRoutine", formData.timeRoutine);
  if (formData.productImage) {
    data.append("productImage", formData.productImage);
  }
  return data;
}
