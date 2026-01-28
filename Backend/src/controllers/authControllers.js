import {
  processLogin,
  processRegister,
  forgetPasswordProcess,
  checkOtpProcess,
  resetPasswordProcess,
} from "../services/authServices.js";


/**
 * Handles user login for the mobile application.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { user, token } = await processLogin(email, password);

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
/**
 * Handle register controller for the mobile application.
 *
 * @async
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} req.body
 * @param {string} req.body.email
 * @param {string} req.body.firstname
 * @param {string} req.body.lastname
 * @param {Date} req.body.dob
 * @param {string} req.body.password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function register(req, res) {
  try {
    const { email, firstname, dob, lastname, password } = req.body;

    const newUser = await processRegister(
      email,
      firstname,
      dob,
      lastname,
      password,
    );

    console.log("registered!");
    res.status(201).json({
      message: "Registration successful",
      user: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (err) {
    console.log(err);
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      return res.status(409).json({ error: "Email already registered" }); 
    }

    if (error.message === "REGISTER_FAILED") {
      return res.status(500).json({ error: "Registration failed" }); 
    }
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Handles forget password endpoint
 *
 * @async
 * @function forgetPassword
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }
    // Here you would typically generate a password reset token and send an email
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Handles opt checking endpoint
 *
 * @async
 * @function checkOtp
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {string} req.body.otp - User otp passcode
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function checkOtp(req, res) {
  try {
    const { email, otp } = req.body;
    console.log("email and otp:", email, otp);
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    userId = await checkOtpProcess(email, otp);

    return res.status(200).json({
      message: "OTP verified successfully",
      user_id: userId,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "OTP_INVALID") {
      return res.status(404).json({ error: "Invalid OTP Passcode" });
    }
    if (error.message === "OTP_EXPIRED") {
      return res.status(404).json({ error: "OTP Passcode Is Expired" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Handles password reset endpoint
 *
 * @async
 * @function resetPassword
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User email
 * @param {string} req.body.newPassword - New password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    const reset = await resetPasswordProcess(email, newPassword);
    if (!reset) {
      return res.status(404).json({ error: "Reset Password Failed" });
    }
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User not found" });
    }
    if (error.message === "PASSWORD_REUSED") {
      return res
        .status(400)
        .json({ error: "New password cannot be the same as old password" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
