import { Http } from "./Http";

const registerAccountAPI = (data) => {
  return Http.post("/auth/register", data);
};

const loginAccountAPI = (data) => {
  return Http.post("/auth/login", data);
};

const forgetPasswordAPI = (data) => {
  return Http.post("/auth/forgetpassword", data);
};

const checkOtpAPI = (data) => {
  return Http.post("/auth/checkOTP", data);
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
  return Http.put("/users/skin", data);
};

const resetSkinDataAPI = () => {
  return Http.put("/users/skinreset");
};

const getAllJournalAPI = () => {
  return Http.get("/journals");
};

const getSingleJournalByDateAPI = (date) => {
  return Http.get("/journals/date/" + date);
};

const createJournalAPI = (data) => {
  return Http.post("/journals", data);
};
const updateJournalAPI = (data) => {
  return Http.post("/journals", data);
};

const deleteJournalAPI = () => {
  return Http.delete("/journals");
};

const Api = {
  registerAccountAPI,
  loginAccountAPI,
  forgetPasswordAPI,
  checkOtpAPI,
  getUserbyTokenAPI,
  deleteUserAPI,
  editUserAPI,
  updateSkinDataAPI,
  resetSkinDataAPI,
  getAllJournalAPI,
  createJournalAPI,
  updateJournalAPI,
  deleteJournalAPI,
  getSingleJournalByDateAPI,
};
export default Api;
