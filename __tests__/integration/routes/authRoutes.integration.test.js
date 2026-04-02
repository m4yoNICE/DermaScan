import request from "supertest";
import app from "../../../app.js";
import {
  mockAuthEmpty,
  mockAuthInvalid,
  mockAuthRegister,
  uniqueEmail,
} from "../mockDetails.js";

describe("Auth routes integration tests", () => {
  describe("POST /api/auth/login", () => {
    it("returns 401 with empty body", async () => {
      const res = await request(app).post("/api/auth/login").send(mockAuthEmpty);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("returns 401 with invalid credentials (non-existent user)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(mockAuthInvalid);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("returns 200 with valid credentials after registration", async () => {
      const uniqueUserEmail = uniqueEmail("integration-login");
      const password = "testpass123";

      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "Login",
          lastname: "Test",
          dob: "1995-06-20",
          password,
        });

      expect(registerRes.statusCode).toBe(201);

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: uniqueUserEmail, password });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body.message).toBe("Login successful");
      expect(loginRes.body.user).toBeDefined();
      expect(loginRes.body.user.email).toBe(uniqueUserEmail);
      expect(loginRes.body.token).toBeDefined();
    });
  });

  describe("POST /api/auth/register", () => {
    it("returns 201 with valid registration", async () => {
      const uniqueUserEmail = uniqueEmail("integration-register");
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Registration successful");
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(uniqueUserEmail);
      expect(res.body.token).toBeDefined();
    });

    it("returns 400 with invalid date format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          dob: "not-a-date",
          password: "password123",
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
          password: "password123",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid date format/);
    });

    it("returns 400 with invalid dob format (DD-MM-YYYY)", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          dob: "15-01-1990",
          password: "password123",
        });
      expect(res.statusCode).toBe(400);
    });

    it("returns 409 when email already registered", async () => {
      const uniqueUserEmail = uniqueEmail("integration-duplicate");

      const firstRes = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "First",
          lastname: "User",
          password: "password123",
        });
      expect(firstRes.statusCode).toBe(201);

      const secondRes = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "Second",
          lastname: "User",
          dob: "1992-05-10",
          password: "otherpass456",
        });
      expect(secondRes.statusCode).toBe(409);
      expect(secondRes.body.error).toBe("Email already registered");
    });
  });

  describe("POST /api/auth/forgetpassword", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send(mockAuthEmpty);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email is required");
    });

    it("returns 400 when email is empty string", async () => {
      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send({ email: "" });
      expect(res.statusCode).toBe(400);
    });

    it("returns 404 when email not found", async () => {
      const res = await request(app)
        .post("/api/auth/forgetpassword")
        .send({
          email: "definitely-not-registered@integration-test.example.com",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Email not found");
    });

    it("returns 200 when email exists and OTP is sent (or 500 if email not configured)", async () => {
      const uniqueUserEmail = uniqueEmail("integration-forget");

      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "Forget",
          lastname: "Password",
          password: "testpass123",
        });
      expect(registerRes.statusCode).toBe(201);

      const forgetRes = await request(app)
        .post("/api/auth/forgetpassword")
        .send({ email: uniqueUserEmail });

      expect([200, 500]).toContain(forgetRes.statusCode);
      if (forgetRes.statusCode === 200) {
        expect(forgetRes.body.message).toBe("OTP sent to your email.");
      }
    });
  });

  describe("POST /api/auth/checkOTP", () => {
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
      const uniqueUserEmail = uniqueEmail("integration-otp-invalid");

      await request(app)
        .post("/api/auth/register")
        .send({
          ...mockAuthRegister,
          email: uniqueUserEmail,
          firstname: "OTP",
          lastname: "Test",
          password: "testpass123",
        });

      const res = await request(app)
        .post("/api/auth/checkOTP")
        .send({ email: uniqueUserEmail, otp: "000000" });

      expect([404, 500]).toContain(res.statusCode);
      if (res.statusCode === 404) {
        expect(res.body.error).toBe("Invalid OTP Passcode");
      }
    });
  });
});
