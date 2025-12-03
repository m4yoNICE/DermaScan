import {
  findUserByEmail,
  createUser,
  saveOTP,
  usedOTP,
  findOTP,
  createAccessToken,
} from "../services/authServices.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendOTP.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user.id, email: user.email };

    const token = await createAccessToken(payload);

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function register(req, res) {
  try {
    const { email, firstname, dob, lastname, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const role = 2;
    const newUser = await createUser(
      email,
      firstname,
      dob,
      lastname,
      password,
      role
    );

    // Immediately issue token (same as login)
    const payload = { id: newUser.id, email: newUser.email };
    const token = await createAccessToken(payload);
    console.log("registered!");
    res.status(201).json({
      message: "Registration successful",
      user: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function forgetpassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ error: "Email Not Found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    //save and update old otp to database
    await usedOTP(existingUser.id);
    await saveOTP(existingUser.id, otp, expiresAt);

    //send otp to email
    const sendemail = sendEmail(email, otp);
    console.log(sendemail);
    if (!sendemail) {
      return res.status(404).json({ error: "Error in Sending Email" });
    }
    return res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function checkotp(req, res) {
  try {
    const { email, otp } = req.body;
    console.log("email and otp:", email, otp);
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
    //find email
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    //checks if otp matched or used
    const storedOTP = await findOTP(existingUser.id, otp);

    if (!storedOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check expiry safely
    if (Date.now() > new Date(storedOTP.expiresAt).getTime()) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    //update OTP to used
    storedOTP.isUsed = true;
    await storedOTP.save();
    return res.status(200).json({
      message: "OTP verified successfully",
      user_id: existingUser.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function resetpassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    const user = findUserByEmail(email);
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        error: "New password cannot be the same as the old password.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
