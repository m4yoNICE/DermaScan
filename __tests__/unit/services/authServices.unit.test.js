import { jest } from "@jest/globals";

// Mock dependencies before importing authServices
const mockFindFirst = jest.fn();
const mockInsertValues = jest.fn();
const mockUpdateSet = jest.fn();

const mockDb = {
  query: {
    users: {
      findFirst: mockFindFirst,
    },
    otp: {
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnValue({
    values: mockInsertValues,
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));
jest.unstable_mockModule("../../../utils/createAccessToken.js", () => ({
  createAccessToken: jest.fn().mockResolvedValue("mock-jwt-token"),
}));
jest.unstable_mockModule("../../../utils/sendOTP.js", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue("hashed-password"),
  },
}));

const authServices = await import("../../../services/authServices.js");
const bcrypt = (await import("bcryptjs")).default;

describe("authServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.query.users.findFirst = mockFindFirst;
    mockDb.query.otp.findFirst = jest.fn();
  });

  describe("module exports", () => {
    test("exports processLogin, processRegister, forgetPasswordProcess, checkOtpProcess", () => {
      expect(authServices.processLogin).toBeDefined();
      expect(authServices.processRegister).toBeDefined();
      expect(authServices.forgetPasswordProcess).toBeDefined();
      expect(authServices.checkOtpProcess).toBeDefined();
      expect(authServices.findUserByEmail).toBeDefined();
    });
  });

  describe("processLogin", () => {
    test("throws INVALID_CREDENTIALS when user not found", async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        authServices.processLogin("nonexistent@example.com", "password")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    test("throws INVALID_CREDENTIALS when password is wrong", async () => {
      mockFindFirst.mockResolvedValue({
        id: 1,
        email: "user@example.com",
        password: "hashed-pass",
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authServices.processLogin("user@example.com", "wrongpassword")
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    test("returns user and token on valid credentials", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        password: "hashed-pass",
        role: 2,
      };
      mockFindFirst.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await authServices.processLogin(
        "user@example.com",
        "correctpass"
      );

      expect(result).toHaveProperty("user", mockUser);
      expect(result).toHaveProperty("token", "mock-jwt-token");
    });
  });

  describe("processRegister", () => {
    test("throws EMAIL_ALREADY_REGISTERED when email exists", async () => {
      mockFindFirst
        .mockResolvedValueOnce({ id: 1, email: "existing@example.com" })
        .mockResolvedValue(null);

      await expect(
        authServices.processRegister(
          "existing@example.com",
          "John",
          "1990-01-15",
          "Doe",
          "password123"
        )
      ).rejects.toThrow("EMAIL_ALREADY_REGISTERED");
    });
  });

  describe("forgetPasswordProcess", () => {
    test("throws EMAIL_NOT_FOUND when user does not exist", async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        authServices.forgetPasswordProcess("nonexistent@example.com")
      ).rejects.toThrow("EMAIL_NOT_FOUND");
    });
  });

  describe("checkOtpProcess", () => {
    test("throws OTP_INVALID when user not found", async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(
        authServices.checkOtpProcess("user@example.com", "123456")
      ).rejects.toThrow("OTP_INVALID");
    });

    test("throws OTP_INVALID when OTP not found", async () => {
      mockFindFirst.mockResolvedValue({ id: 1, email: "user@example.com" });
      mockDb.query.otp.findFirst.mockResolvedValue(null);

      await expect(
        authServices.checkOtpProcess("user@example.com", "000000")
      ).rejects.toThrow("OTP_INVALID");
    });

    test("throws OTP_EXPIRED when OTP has expired", async () => {
      const expiredDate = new Date(Date.now() - 10 * 60 * 1000);
      mockFindFirst.mockResolvedValue({ id: 1, email: "user@example.com" });
      mockDb.query.otp.findFirst.mockResolvedValue({
        id: 1,
        expiresAt: expiredDate.toISOString(),
      });

      await expect(
        authServices.checkOtpProcess("user@example.com", "123456")
      ).rejects.toThrow("OTP_EXPIRED");
    });
  });
});
