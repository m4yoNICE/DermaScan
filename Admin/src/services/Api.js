import { Http } from "./Http";

const Api = {
  loginAccountAPI: (data) => {
    return Http.post("/api/admin/auth/login", data);
  },

  fetchUsersAPI: () => {
    return Http.get("/api/admin/users/");
  },

  getUsersData: (config = {}) => {
    return Http.get("/api/admin/users/getData", config);
  },

  CreateUsersAPI: (formData) => {
    return Http.post("/api/admin/users/", formData);
  },

  getUserById: (id) => {
    return Http.get("/api/admin/users/getById/" + id);
  },

  editUserAPI: (id, userData) => {
    return Http.put("/api/admin/users/" + id, userData);
  },

  deleteUserAPI: (id) => {
    return Http.delete("/api/admin/users/delete/" + id);
  },

  //skin products api endpoints
  getSkinProducts: (config = {}) => {
    return Http.get("api/admin/products/getSkinProducts", config);
  },

  getProductById: (id) => {
    return Http.get("/api/admin/products/getSkinProductsById/" + id);
  },

  createProductAPI: (data) => {
    return Http.post("/api/admin/products/createSkinProduct", data);
  },

  updateProductAPI: (id, data) => {
    return Http.put("/api/admin/products/updateSkinProduct/" + id, data);
  },

  deleteProductAPI: (id) => {
    return Http.delete("/api/admin/products/deleteSkinProduct/" + id);
  },

  // out of scope api endpoints
  getOutOfScopeData: (config = {}) => {
    return Http.get("/api/admin/scope/out-of-scope", config);
  },

  fetchScansPerDay: (config = {}) => {
    return Http.get("/api/admin/scope/scans", config);
  },

  getSkinTypes: (config = {}) => {
    return Http.get("/api/admin/skin-types/getSkinTypes", config);
  },

  // Generate reports endpoint
  generateProductReport: () => {
    return Http.get("/api/admin/reports/generate/product", {
      responseType: "blob",
    });
  },
  generateUserReport: () => {
    return Http.get("/api/admin/reports/generate/user", {
      responseType: "blob",
    });
  },
  generateAnalysisReport: () => {
    return Http.get("/api/admin/reports/generate/analysis", {
      responseType: "blob",
    });
  },

  getAnalysisData: () => Http.get("/api/admin/analysis"),
  getConditions: () => Http.get("/api/admin/analysis/condition"),

  getSkinImage: (data) =>
    Http.defaults.baseURL + "/api/uploads/skin-images/" + data,
  getProductImage: (data) =>
    data?.startsWith("http")
      ? data
      : Http.defaults.baseURL + "/api/uploads/product-images/" + data,
};

export default Api;
