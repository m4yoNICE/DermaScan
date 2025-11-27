import { Http } from "./Http";

const loginAccountAPI = (data) => {
  return Http.post("/auth/login", data);
};
const fetchUsersAPI = () => {
  return Http.get("/admin/users");
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
  editUserAPI 
};

export default Api;
