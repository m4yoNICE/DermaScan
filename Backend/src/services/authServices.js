import { db } from "../config/db.js";
import { eq, and } from "drizzle-orm";
import { users } from "../drizzle/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

/**
 * Processes user login business logic.
 *
 * @async
 * @function processLogin
 * @param {string} email - User email
 * @param {string} password - Plain-text password
 * @returns {Promise<{ user: Object, token: string }>}
 * @throws {Error} If credentials are invalid
 */
export async function processLogin(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  //for tokenization
  const payload = { id: user.id, email: user.email };
  const token = await createAccessToken(payload);

  return { user, token };
}

export async function processRegister(
  email,
  firstname,
  dob,
  lastname,
  password,
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }
  const role = 2;
  const newUser = await createUser(
    email,
    firstname,
    dob,
    lastname,
    password,
    role,
  );
  if (!newUser) throw new Error("REGISTER_FAILED");

  // Immediately issue token (same as login)
  const payload = { id: newUser.id, email: newUser.email };
  const token = await createAccessToken(payload);

  return { token, newUser };
}

/**
 * Handles forgot-password flow.
 *
 * @async
 * @function forgetPasswordProcess
 * @param {string} email
 * @returns {Promise<void>}
 * @throws {Error} EMAIL_NOT_FOUND
 * @throws {Error} EMAIL_SEND_FAILED
 */
export async function forgetPasswordProcess(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("EMAIL_NOT_FOUND");
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await usedOTP(user.id);
  await saveOTP(user.id, otp, expiresAt);

  const sent = await sendEmail(email, otp);
  if (!sent) {
    throw new Error("EMAIL_SEND_FAILED");
  }
}

/**
 * Verifies OTP for a user.
 *
 * @async
 * @function checkOtpProcess
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<number>} userId
 * @throws {Error} OTP_INVALID
 * @throws {Error} OTP_EXPIRED
 */
export async function checkOtpProcess(email, otp) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("OTP_INVALID");
  }

  const storedOTP = await findOTP(user.id, otp);
  if (!storedOTP) {
    throw new Error("OTP_INVALID");
  }

  if (Date.now() > new Date(storedOTP.expiresAt).getTime()) {
    throw new Error("OTP_EXPIRED");
  }

  storedOTP.isUsed = true;
  await storedOTP.save();

  return user.id;
}

/**
 * Resets user password.
 *
 * @async
 * @function resetPasswordProcess
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise<void>}
 * @throws {Error} PASSWORD_REUSED
 */
export async function resetPasswordProcess(email, newPassword) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new Error("PASSWORD_REUSED");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}

/**
 * Helper Functions
 *
 */
export async function findUserByEmail(email) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function createUser(
  email,
  first_name,
  birthdate,
  last_name,
  password,
  role,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [registered] = await db
    .insert(users)
    .values({
      email,
      first_name,
      last_name,
      birthdate,
      password: passwordHash,
      role_id: role,
    })
    .$returningId();

  return await db.query.users.findFirst({
    where: eq(users.id, registered.id),
  });
}

export async function createAccessToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export async function saveOTP(user_id, otp_code, expiresAt) {
  const [inserted] = await db
    .insert(otp)
    .values({
      user_id,
      otp_code,
      isUsed: false,
      expiresAt,
    })
    .$returningId();

  return await db.query.otp.findFirst({
    where: eq(otp.id, inserted.id),
  });
}

export async function usedOTP(user_id) {
  return await db
    .update(otp)
    .set({ isUsed: true })
    .where(and(eq(otp.user_id, user_id), eq(otp.isUsed, false)));
}

export async function findOTP(user_id, otp) {
  return await db.query.otp.findFirst({
    where: and(
      eq(otp.userId, user_id),
      eq(otp.otpCode, otp_code),
      eq(otp.isUsed, false),
    ),
    orderBy: otp.createdAt.desc(),
  });
}

export async function resetPasword(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  await db
    .update(users)
    .set({ password: hashed })
    .where(eq(users.email, email));

  return await findUserByEmail(email);
}
