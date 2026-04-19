import { jest } from "@jest/globals";

// Mock authServices before importing the controller
const mockProcessLogin = jest.fn();
const mockProcessRegister = jest.fn();
const mockForgetPasswordProcess = jest.fn();
const mockCheckOtpProcess = jest.fn();
const mockResetPasswordProcess = jest.fn();

jest.unstable_mockModule("../../../services/authServices.js", () => ({
  processLogin: mockProcessLogin,
  processRegister: mockProcessRegister,
  forgetPasswordProcess: mockForgetPasswordProcess,
  checkOtpProcess: mockCheckOtpProcess,
  resetPasswordProcess: mockResetPasswordProcess,
}));

const authController = await import("../../../controllers/authController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("valid login returns 200 with user and token", async () => {
      const user = { id: 1, email: "user@example.com", role: 2 };
      const token = "jwt-token-123";
      mockProcessLogin.mockResolvedValue({ user, token });

      const req = { body: { email: "user@example.com", password: "password123" } };
      const res = createResMock();

      await authController.login(req, res);

      expect(mockProcessLogin).toHaveBeenCalledWith("user@example.com", "password123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: { id: 1, email: "user@example.com", role: 2 },
        token,
      });
    });

    test("invalid credentials returns 401", async () => {
      mockProcessLogin.mockRejectedValue(new Error("INVALID_CREDENTIALS"));

      const req = { body: { email: "wrong@example.com", password: "wrongpass" } };
      const res = createResMock();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    test("missing email or password returns 401 (invalid credentials)", async () => {
      mockProcessLogin.mockRejectedValue(new Error("INVALID_CREDENTIALS"));

      const req = { body: {} };
      const res = createResMock();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    test("unexpected error returns 500", async () => {
      mockProcessLogin.mockRejectedValue(new Error("DATABASE_ERROR"));

      const req = { body: { email: "user@example.com", password: "pass" } };
      const res = createResMock();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("register", () => {
    const validBody = {
      email: "new@example.com",
      firstname: "John",
      lastname: "Doe",
      dob: "1990-01-15",
      password: "securepass123",
    };

    test("valid registration returns 201 with user and token", async () => {
      const newUser = { id: 2, email: "new@example.com" };
      const token = "jwt-token-456";
      mockProcessRegister.mockResolvedValue({ newUser, token });

      const req = { body: validBody };
      const res = createResMock();

      await authController.register(req, res);

      expect(mockProcessRegister).toHaveBeenCalledWith(
        "new@example.com",
        "John",
        "1990-01-15",
        "Doe",
        "securepass123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registration successful",
        user: { id: 2, email: "new@example.com" },
        token,
      });
    });

    test("invalid date format returns 400", async () => {
      const req = {
        body: {
          ...validBody,
          dob: "not-a-date",
        },
      };
      const res = createResMock();

      await authController.register(req, res);

      expect(mockProcessRegister).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid date format. Use YYYY-MM-DD.",
      });
    });

    test("missing dob returns 400", async () => {
      const { dob, ...bodyWithoutDob } = validBody;
      const req = { body: bodyWithoutDob };
      const res = createResMock();

      await authController.register(req, res);

      expect(mockProcessRegister).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("email already registered returns 409", async () => {
      mockProcessRegister.mockRejectedValue(new Error("EMAIL_ALREADY_REGISTERED"));

      const req = { body: validBody };
      const res = createResMock();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already registered" });
    });

    test("registration failed returns 500", async () => {
      mockProcessRegister.mockRejectedValue(new Error("REGISTER_FAILED"));

      const req = { body: validBody };
      const res = createResMock();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Registration failed" });
    });

    test("invalid dob format DD-MM-YYYY returns 400", async () => {
      const req = {
        body: {
          ...validBody,
          dob: "15-01-1990",
        },
      };
      const res = createResMock();

      await authController.register(req, res);

      expect(mockProcessRegister).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("forgetPassword (email)", () => {
    test("valid email returns 200 and OTP sent message", async () => {
      mockForgetPasswordProcess.mockResolvedValue(undefined);

      const req = { body: { email: "user@example.com" } };
      const res = createResMock();

      await authController.forgetPassword(req, res);

      expect(mockForgetPasswordProcess).toHaveBeenCalledWith("user@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "OTP sent to your email." });
    });

    test("missing email returns 400", async () => {
      const req = { body: {} };
      const res = createResMock();

      await authController.forgetPassword(req, res);

      expect(mockForgetPasswordProcess).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email is required" });
    });

    test("empty string email returns 400", async () => {
      const req = { body: { email: "" } };
      const res = createResMock();

      await authController.forgetPassword(req, res);

      expect(mockForgetPasswordProcess).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("email not found returns 404", async () => {
      mockForgetPasswordProcess.mockRejectedValue(new Error("EMAIL_NOT_FOUND"));

      const req = { body: { email: "nonexistent@example.com" } };
      const res = createResMock();

      await authController.forgetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Email not found" });
    });

    test("email send failed returns 500", async () => {
      mockForgetPasswordProcess.mockRejectedValue(new Error("EMAIL_SEND_FAILED"));

      const req = { body: { email: "user@example.com" } };
      const res = createResMock();

      await authController.forgetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to send OTP email" });
    });
  });

  describe("checkOtp", () => {
    test("valid email and OTP returns 200 with user_id", async () => {
      mockCheckOtpProcess.mockResolvedValue(1);

      const req = { body: { email: "user@example.com", otp: "123456" } };
      const res = createResMock();

      await authController.checkOtp(req, res);

      expect(mockCheckOtpProcess).toHaveBeenCalledWith("user@example.com", "123456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP verified successfully",
        user_id: 1,
      });
    });

    test("missing email returns 400", async () => {
      const req = { body: { otp: "123456" } };
      const res = createResMock();

      await authController.checkOtp(req, res);

      expect(mockCheckOtpProcess).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email and OTP are required" });
    });

    test("missing OTP returns 400", async () => {
      const req = { body: { email: "user@example.com" } };
      const res = createResMock();

      await authController.checkOtp(req, res);

      expect(mockCheckOtpProcess).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email and OTP are required" });
    });

    test("invalid OTP returns 404", async () => {
      mockCheckOtpProcess.mockRejectedValue(new Error("OTP_INVALID"));

      const req = { body: { email: "user@example.com", otp: "000000" } };
      const res = createResMock();

      await authController.checkOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid OTP Passcode" });
    });

    test("expired OTP returns 404", async () => {
      mockCheckOtpProcess.mockRejectedValue(new Error("OTP_EXPIRED"));

      const req = { body: { email: "user@example.com", otp: "123456" } };
      const res = createResMock();

      await authController.checkOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "OTP Passcode Is Expired" });
    });
  });
});
