<<<<<<< HEAD
import Http from "./Http.js";

const getUserSkinTypeAPI = (data) => {
  return Http.get("/users/skin-type", data);
}

const getAllUsersAPI = (data) => {
  return Http.get("/users");
}

const Api = {
    getUserSkinTypeAPI,
    getAllUsersAPI
};

=======
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
const Api = { loginAccountAPI, fetchUsersAPI, deleteUserAPI, editUserAPI };

export default Api;
>>>>>>> origin/main
