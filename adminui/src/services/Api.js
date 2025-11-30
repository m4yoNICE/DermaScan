import { Http } from "./Http";

const loginAccountAPI = (data) => {
  return Http.post("/admin/auth/admin/login", data);
};
const CreateUsersAPI = (formData) => {
  return Http.post("/admin/auth/admin/create-user", formData);
}
const fetchUsersAPI = () => {
  return Http.get("/admin/users/");
};
const deleteUserAPI = (id) => {
  Http.delete("/admin/users/", id);
};
const editUserAPI = (id, userData) => {
  return Http.put(`/admin/auth/admin/update-user/${id}`, userData);
};
const getUserById = (id) => {
  return Http.get(`admin/auth/admin/users/${id}`)
}

const Api = { 
  loginAccountAPI, 
  fetchUsersAPI, 
  deleteUserAPI, 
  editUserAPI,
  CreateUsersAPI,
  getUserById
};

export default Api;
