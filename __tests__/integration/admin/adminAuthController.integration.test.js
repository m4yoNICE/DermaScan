import request from "supertest";
import app from "../../../app.js";
import { mockAuthEmpty, mockAdminAuthInvalid } from "../mockDetails.js";

describe("adminAuthController integration tests (via HTTP)", () => {
  describe("POST /api/admin/auth/login", () => {
    it("returns 400 when body is empty", async () => {
      const res = await request(app).post("/api/admin/auth/login").send(mockAuthEmpty);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and password are required");
    });

    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send({ password: "testpass123" });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and password are required");
    });

    it("returns 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send({ email: "admin@example.com" });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and password are required");
    });

    it("returns 401 for invalid credentials (or 500 when DB is unavailable)", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send(mockAdminAuthInvalid);

      expect([401, 500]).toContain(res.statusCode);
      if (res.statusCode === 401) {
        expect(res.body.error).toBe("Invalid credentials");
      }
    });
  });

  describe("route validation", () => {
    it("returns 404 for unknown admin auth route", async () => {
      const res = await request(app).post("/api/admin/auth/unknown").send(mockAuthEmpty);
      expect(res.statusCode).toBe(404);
    });
  });
});
