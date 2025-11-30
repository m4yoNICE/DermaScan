import { Http } from "./Http";

const loginAccountAPI = (data) => {
  return Http.post("/admin/auth/admin/login", data);
};

const CreateUsersAPI = (formData) => {
  return Http.post("/admin/auth/admin/create-user", formData);
};

const fetchUsersAPI = () => {
  return Http.get("/admin/auth/admin/users");
};

const deleteUserAPI = (id) => {
  return Http.delete(`/admin/auth/admin/users/${id}`);
};

const editUserAPI = (id, payload) => {
  return Http.put(`/admin/auth/admin/users/${id}`, payload);
};
const Api = {
  loginAccountAPI,
  fetchUsersAPI,
  deleteUserAPI,
  editUserAPI,
  CreateUsersAPI,
};

export default Api;
