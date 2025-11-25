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

