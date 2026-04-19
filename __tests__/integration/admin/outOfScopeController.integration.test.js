import request from "supertest";
import app from "../../../app.js";
import { mockInvalidToken } from "../mockDetails.js";

describe("admin outOfScopeController integration tests (via HTTP)", () => {
  const endpoints = [
    { method: "get", path: "/api/admin/scope/scans" },
    { method: "get", path: "/api/admin/scope/out-of-scope" },
    { method: "delete", path: "/api/admin/scope/out-of-scope/1" },
  ];

  endpoints.forEach(({ method, path }) => {
    it(`${method.toUpperCase()} ${path} without token returns 401`, async () => {
      const res = await request(app)[method](path);
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access Denied");
    });
  });

  it("GET /api/admin/scope/scans with invalid token returns 403", async () => {
    const res = await request(app)
      .get("/api/admin/scope/scans")
      .set("Authorization", `Bearer ${mockInvalidToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or Expired Session");
  });

  it("GET unknown admin scope path returns 404", async () => {
    const res = await request(app).get("/api/admin/scope/unknown");
    expect(res.statusCode).toBe(404);
  });
});
