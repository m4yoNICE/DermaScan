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
const editUserAPI = (id) => {
  Http.put("/admin/users/", id);
};
const Api = { 
  loginAccountAPI, 
  fetchUsersAPI, 
  deleteUserAPI, 
  editUserAPI,
  CreateUsersAPI
};

export default Api;
