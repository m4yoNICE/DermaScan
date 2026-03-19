import { FormsData } from "src/utils/FormData";
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
  createSkinDataAPI: (data) => Http.post("/api/users/skin", data),
  resetSkinDataAPI: () => Http.delete("/api/users/skinreset"),

  // Journal
  getAllJournalsAPI: () => Http.get("/api/journals"),
  getJournalByDateAPI: (date) => Http.get("/api/journals/date/" + date),
  createJournalAPI: (data) => Http.post("/api/journals", data),
  updateJournalAPI: (id, data) => Http.put("/api/journals/" + id, data),
  deleteJournalAPI: (id) => Http.delete("/api/journals/" + id),

  // Recommendations
  saveRecommendationApi: (data) => Http.post("/api/recommendations/", data),
  getHistoryAPI: () => Http.get("/api/recommendations"),

  // Routine
  getRoutineScheduleAPI: () => Http.get("/api/routines/schedule"),
  setUserRoutineAPI: (data) => Http.post("/api/routines/schedule", data),
  editUserRoutineAPI: (data) => Http.put("/api/routines/schedule", data),
  getRoutineProductsAPI: () => Http.get("/api/routines/products"),
  completeScheduleAPI: (data) => Http.post("/api/routines/complete", data),
  getReminderLogsAPI: () => Http.get("/api/routines/logs"),
  activateLoadoutAPI: (analysisId) =>
    Http.patch("/api/routines/activate", { analysisId }),
  // Uploads & Images
  getSkinImage: (data) =>
    Http.defaults.baseURL + "/api/uploads/skin-images/" + data,
  getProductImage: (data) =>
    Http.defaults.baseURL + "/api/uploads/product-images/" + data,

  // FormData
  uploadSkinImageAPI: (formData) => FormsData("/api/conditions/skin", formData),
  uploadProfilePicAPI: (formData) => FormsData("/api/profile/pic", formData),
};

export default Api;
