import request from "supertest";
import app from "../../../app.js";
import { mockEndpoints } from "../mockDetails.js";

describe("User routes authentication", () => {
  mockEndpoints.user.forEach(({ method, path, body }) => {
    it(`${method.toUpperCase()} ${path} without token returns 401`, async () => {
      const req = request(app)[method](path);

      if (body !== undefined) req.send(body ?? {});

      const res = await req;

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access Denied");
    });
  });

  it("PUT /api/users with invalid token returns 403", async () => {
    const res = await request(app)
      .put("/api/users")
      .set("Authorization", "Bearer invalid.token.value")
      .send({});

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid or Expired Session");
  });
});