import request from "supertest";
import app from "../../../app.js";
import { mockInvalidToken } from "../mockDetails.js";

describe("admin skinCareProductController integration tests (via HTTP)", () => {
  const endpoints = [
    { method: "get", path: "/api/admin/products/getSkinProducts" },
    { method: "get", path: "/api/admin/products/getSkinProductsById/1" },
    {
      method: "post",
      path: "/api/admin/products/createSkinProduct",
      body: { productName: "Test Product" },
    },
    {
      method: "put",
      path: "/api/admin/products/updateSkinProduct/1",
      body: { productName: "Updated Product" },
    },
    { method: "delete", path: "/api/admin/products/deleteSkinProduct/1" },
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

  it("GET /api/admin/products/getSkinProducts with invalid token returns 403", async () => {
    const res = await request(app)
      .get("/api/admin/products/getSkinProducts")
      .set("Authorization", `Bearer ${mockInvalidToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or Expired Session");
  });

  it("GET unknown admin products path returns 404", async () => {
    const res = await request(app).get("/api/admin/products/unknown");
    expect(res.statusCode).toBe(404);
  });
});
