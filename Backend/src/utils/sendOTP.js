import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";
export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: ENV.OTP_MAILTRAP_USER,
    pass: ENV.OTP_MAILTRAP_PASSWORD,
  },
});
