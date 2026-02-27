import { FormsData } from "src/utils/FormData";
import { Http } from "./Http";

<<<<<<< HEAD
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

<<<<<<< HEAD
<<<<<<< HEAD
const resetPasswordAPI = (data) => {
  return Http.post("/auth/reset-password", data);
};

// const forgetPasswordAPI = (data) => {
//   return Http.post("/auth/forget-password", data);
// }

=======
const getConditionById = (id) => {
  return Http.get(`/condition/${id}`);
=======
const getConditionByIdAPI = (id) => {
  return Http.get("/condition/" + id);
};

const getImageByIdAPI = (id) => {
  return Http.get("/images/results/" + id);
};

const getImage = (filename) => {
  console.log(filename);
  return `${Http.defaults.baseURL}/uploads/${filename}`;
>>>>>>> origin/main
};

>>>>>>> origin/main
=======
>>>>>>> 655f91e83bd85e6a53ce18599574e9051a541594
const Api = {
  // Auth
  registerAccountAPI: (data) => Http.post("/api/auth/register", data),
  loginAccountAPI: (data) => Http.post("/api/auth/login", data),
  forgetPasswordAPI: (data) => Http.post("/api/auth/forgetpassword", data),
  checkOtpAPI: (data) => Http.post("/api/auth/checkOTP", data),

  // User
  getUserByTokenAPI: () => Http.get("/api/users"),
  editUserAPI: (data) => Http.put("/api/users", data),
  deleteUserAPI: () => Http.delete("/api/users"),
  updateSkinDataAPI: (data) => Http.post("/api/users/skin", data),
  resetSkinDataAPI: () => Http.delete("/api/users/skinreset"),

  // Journal
  getAllJournalsAPI: () => Http.get("/api/journals"),
  getJournalByDateAPI: (date) => Http.get("/api/journals/date/" + date),
  createJournalAPI: (data) => Http.post("/api/journals", data),
  updateJournalAPI: (id, data) => Http.put("/api/journals/" + id, data),
  deleteJournalAPI: (id) => Http.delete("/api/journals/" + id),

  // Uploads & Images
  getSkinImage: (data) => {
    return Http.defaults.baseURL + "/api/uploads/skin-images/" + data;
  },
  getProductImage: (data) => {
    return Http.defaults.baseURL + "/api/uploads/product-images/" + data;
  },

  //FormData
  uploadSkinImageAPI: (formData) => FormsData("/api/condition/skin", formData),
  uploadProfilePicAPI: (formData) => FormsData("/api/profile/pic", formData),
};

export default Api;
