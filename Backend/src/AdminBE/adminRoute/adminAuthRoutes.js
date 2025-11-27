import express from "express";
import  Authlogin  from "../adminController/adminAuthController.js";
const router = express.Router();

router.post("/admin/login", Authlogin);

export default router;