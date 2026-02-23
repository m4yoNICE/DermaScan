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

<<<<<<< HEAD
  getOutofScopeData: (id) => {
    return Http.get("/api/admin/users/stats/out-of-scope/" + id);
=======
  //skin products api endpoints
  getSkinProducts: (config = {}) => {
    return Http.get("api/admin/products/getSkinProducts", config)
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
>>>>>>> 5e1c5c251a3e6ab5aeed7c48adaecd65d27e4ce6
  },
};

export default Api;
