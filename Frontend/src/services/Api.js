import { Http } from "./Http";

const Api = {
  // Auth
  registerAccountAPI: (data) => Http.post("/auth/register", data),
  loginAccountAPI: (data) => Http.post("/auth/login", data),
  forgetPasswordAPI: (data) => Http.post("/auth/forgetpassword", data),
  checkOtpAPI: (data) => Http.post("/auth/checkOTP", data),

  // User
  getUserByTokenAPI: () => Http.get("/users"),
  editUserAPI: (data) => Http.put("/users", data),
  deleteUserAPI: () => Http.delete("/users"),
  updateSkinDataAPI: (data) => Http.post("/users/skin", data),
  resetSkinDataAPI: () => Http.delete("/users/skinreset"),

  // Journal
  getAllJournalsAPI: () => Http.get("/journals"),
  getJournalByDateAPI: (date) => Http.get(`/journals/date/${date}`),
  createJournalAPI: (data) => Http.post("/journals", data),
  updateJournalAPI: (id, data) => Http.put(`/journals/${id}`, data),
  deleteJournalAPI: (id) => Http.delete(`/journals/${id}`),

  // Uploads & Images
  getUploadedAPI: (data) => Http.get("/uploads", data),
  getConditionByIdAPI: (id) => Http.get(`/condition/${id}`),
  getImageByIdAPI: (id) => Http.get(`/images/results/${id}`),
  getImageAPI: (filename) => `${Http.defaults.baseURL}/uploads/${filename}`,
};

export default Api;
