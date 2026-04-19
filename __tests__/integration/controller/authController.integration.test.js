import request from "supertest";
import app from "../../../app.js";
import {
  mockAuthEmpty,
  mockAuthInvalid,
  mockAuthRegister,
  mockAuthLogin,
  uniqueEmail,
} from "../mockDetails.js";

describe("authController integration tests (via HTTP)", () => {
  describe("login", () => {
    it("returns 401 with empty body", async () => {
      const res = await request(app).post("/api/auth/login").send(mockAuthEmpty);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("returns 401 with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(mockAuthInvalid);
      expect(res.statusCode).toBe(401);
    });

    it("returns 200 with valid credentials", async () => {
      const uniqueUserEmail = uniqueEmail("controller-login");
      const password = mockAuthLogin.password;

      await request(app).post("/api/auth/register").send({
        ...mockAuthRegister,
        email: uniqueUserEmail,
        firstname: "Ctrl",
        lastname: "Test",
        dob: mockAuthRegister.dob,
        password,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: uniqueUserEmail, password });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });
  });

  describe("register", () => {
    it("returns 400 with invalid date format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          dob: "invalid-date",
          password: "pass123",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid date format/);
    });

    it("returns 400 with missing dob", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: mockAuthRegister.email,
          firstname: "Test",
          lastname: "User",
          password: "pass123",
        });
      expect(res.statusCode).toBe(400);
    });

    it("returns 201 with valid registration", async () => {
      const uniqueUserEmail = uniqueEmail("controller-register");
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.user.email).toBe(uniqueUserEmail);
    });

    it("returns 409 when email already registered", async () => {
      const uniqueUserEmail = uniqueEmail("controller-duplicate");

      await request(app).post("/api/auth/register").send({
        ...mockAuthRegister,
        email: uniqueUserEmail,
        firstname: "First",
        lastname: "User",
        password: "pass123",
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "Second",
          lastname: "User",
          dob: "1992-05-10",
          password: "otherpass",
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe("Email already registered");
    });
  });

  describe("forgetPassword (email)", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send(mockAuthEmpty);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email is required");
    });

    it("returns 404 when email not found", async () => {
      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send({
          email: "not-registered@controller-test.example.com",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Email not found");
    });

    it("returns 200 when email exists (or 500 if email not configured)", async () => {
      const uniqueUserEmail = uniqueEmail("controller-forget");

      await request(app).post("/api/auth/register").send({
        ...mockAuthRegister,
        email: uniqueUserEmail,
        firstname: "Forget",
        lastname: "Test",
        password: "pass123",
      });

      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send({ email: uniqueUserEmail });

      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.message).toBe("OTP sent to your email.");
      }
    });
  });

  describe("checkOtp", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/checkOTP")
        .send({ otp: "123456" });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and OTP are required");
    });

    it("returns 400 when OTP is missing", async () => {
      const res = await request(app)
        .post("/api/auth/checkOTP")
        .send({ email: mockAuthRegister.email });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and OTP are required");
    });

    it("returns 404 when OTP is invalid (or 500 on DB error)", async () => {
      const uniqueUserEmail = uniqueEmail("controller-otp");

      await request(app).post("/api/auth/register").send({
        ...mockAuthRegister,
        email: uniqueUserEmail,
        firstname: "OTP",
        lastname: "Test",
        password: "pass123",
      });

      const res = await request(app)
        .post("/api/auth/checkOTP")
        .send({ email: uniqueUserEmail, otp: "999999" });

      expect([404, 500]).toContain(res.statusCode);
      if (res.statusCode === 404) {
        expect(res.body.error).toBe("Invalid OTP Passcode");
      }
    });
  });
});
