import Http from "./Http";

const registerAccountAPI = (data) => {
  return Http.post("/auth/register", data);
};

const loginAccountAPI = (data) => {
  return Http.post("/auth/login", data);
};

const getUserbyTokenAPI = () => {
  return Http.get("/users");
};

const editUserAPI = (data) => {
  return Http.put("/users", data);
};

const deleteUserAPI = () => {
  return Http.delete("/users");
};

const updateSkinDataAPI = (data) => {
  return Http.post("/users/skin", data);
};
const Api = {
  registerAccountAPI,
  loginAccountAPI,
  getUserbyTokenAPI,
  deleteUserAPI,
  editUserAPI,
  updateSkinDataAPI,
};
export default Api;
