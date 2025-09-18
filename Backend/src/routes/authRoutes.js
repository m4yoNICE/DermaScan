import express from "express"
import {login, register} from "../controllers/authControllers.js"

const router = express.Router();

router.post("/", login);
router.post("/", register);