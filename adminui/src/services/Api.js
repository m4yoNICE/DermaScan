import { Http } from "./Http";

const loginAccountAPI = (data) => {
  return Http.post("/admin/auth/login", data);
};

const fetchUsersAPI = () => {
  return Http.get("/admin/users/");
};

const CreateUsersAPI = (formData) => {
  return Http.post("/admin/users/", formData);
};

const getUserById = (id) => {
  return Http.get(`admin/users/${id}`);
};

const editUserAPI = (id, userData) => {
  return Http.put(`/admin/users/${id}`, userData);
};

const deleteUserAPI = (id) => {
  return Http.delete(`/admin/users/${id}`);
};

const Api = {
  loginAccountAPI,
  fetchUsersAPI,
  deleteUserAPI,
  editUserAPI,
  CreateUsersAPI,
  getUserById,
};

export default Api;
