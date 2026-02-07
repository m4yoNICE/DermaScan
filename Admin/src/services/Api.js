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
};

export default Api;
