import { Http } from "./Http";

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
  getUploadedAPI: (data) => Http.get("/api/uploads", data),
  getImageByIdAPI: (id) => Http.get("/api/images/results/" + id),
  getImageAPI: (filename) => `${Http.defaults.baseURL}/uploads/${filename}`,
};

export default Api;
