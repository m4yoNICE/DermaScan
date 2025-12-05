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
  return Http.post("/users/skin", data);
};

const resetSkinDataAPI = () => {
  return Http.delete("/users/skinreset");
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
const updateJournalAPI = (id, data) => {
  return Http.put("/journals/" + id, data);
};

const deleteJournalAPI = (id) => {
  return Http.delete("/journals/" + id);
};

const getUploadedAPI = (data) => {
  return Http.get("/uploads", data);
};

const getConditionByIdAPI = (id) => {
  return Http.get("/condition/" + id);
};

const getImageByIdAPI = (id) => {
  return Http.get("/images/results/" + id);
};

const getImage = (filename) => {
  console.log(filename);
  return `${Http.defaults.baseURL}/uploads/${filename}`;
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
  getUploadedAPI,
  getImageByIdAPI,
  getConditionByIdAPI,
  getImage,
};
export default Api;
