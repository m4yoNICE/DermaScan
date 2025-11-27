import { Http } from "./Http";

const loginAccountAPI = (data) => {
  return Http.post("/auth/login", data);
};
const fetchUsersAPI = (data) => {
  return Http.get("/admin/users", data);
};
const fetchSkinUsersAPI = (data) => {
  return Http.get("/admin/users", data);
}
const deleteUserAPI = (id) => {
  Http.delete("/admin/users/", id);
};
const editUserAPI = (id) => {
  Http.put("/admin/users/", id);
};
const Api = { 
  loginAccountAPI, 
  fetchUsersAPI, 
  fetchSkinUsersAPI,
  deleteUserAPI, 
  editUserAPI
};

export default Api;
