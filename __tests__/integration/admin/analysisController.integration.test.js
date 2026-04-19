import request from "supertest";
import app from "../../../app.js";
import { mockInvalidToken } from "../mockDetails.js";

describe("admin analysisController integration tests (via HTTP)", () => {
  const endpoints = [
    { method: "get", path: "/api/admin/analysis/" },
    { method: "get", path: "/api/admin/analysis/condition/" },
  ];

  endpoints.forEach(({ method, path }) => {
    it(`${method.toUpperCase()} ${path} without token returns 401`, async () => {
      const res = await request(app)[method](path);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access Denied");
    });
  });

  it("GET /api/admin/analysis/ with invalid token returns 403", async () => {
    const res = await request(app)
      .get("/api/admin/analysis/")
      .set("Authorization", `Bearer ${mockInvalidToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or Expired Session");
  });

  it("GET unknown admin analysis path returns 404", async () => {
    const res = await request(app).get("/api/admin/analysis/unknown");
    expect(res.statusCode).toBe(404);
  });
});
