import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.OTP_USER,
    pass: ENV.OTP_PASSWORD_OTP,
  },
});

export const sendEmail = async (email, otp) => {
  try {
    console.log("Email and OTP: ", email, otp);
    await transporter.sendMail({
      from: `"DermaScan+" <${ENV.OTP_USER}>`,
      to: email,
      subject: `Your OTP is ${otp}`,
      html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("Email sent successfully.");
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};
