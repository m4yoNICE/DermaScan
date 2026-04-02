import request from "supertest";
import app from "../../../app.js";
import {
  mockAuthEmpty,
  mockInvalidToken,
  mockAdminCreateUserPayload,
  mockAdminUpdateUserPayload,
} from "../mockDetails.js";

describe("adminUsersController integration tests (via HTTP)", () => {
  const endpoints = [
    { method: "get", path: "/api/admin/users/admin" },
    { method: "get", path: "/api/admin/users/getData" },
    { method: "get", path: "/api/admin/users/getById/1" },
    { method: "post", path: "/api/admin/users", body: mockAdminCreateUserPayload },
    { method: "put", path: "/api/admin/users/1", body: mockAdminUpdateUserPayload },
    { method: "delete", path: "/api/admin/users/delete/1" },
  ];

  endpoints.forEach(({ method, path, body }) => {
    it(`${method.toUpperCase()} ${path} without token returns 401`, async () => {
      const req = request(app)[method](path);
      if (body !== undefined) req.send(body);
      const res = await req;

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access Denied");
    });
  });

  it("GET /api/admin/users/getData with invalid token returns 403", async () => {
    const res = await request(app)
      .get("/api/admin/users/getData")
      .set("Authorization", `Bearer ${mockInvalidToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or Expired Session");
  });

  it("GET unknown admin users path returns 404", async () => {
    const res = await request(app)
      .get("/api/admin/users/unknown")
      .send(mockAuthEmpty);

    expect(res.statusCode).toBe(404);
  });
});
