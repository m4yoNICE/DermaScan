import request from "supertest";
import app from "../../../app.js";
import { mockAuthEmpty } from "../mockDetails.js";

describe("Admin routes", () => {
  it("POST /api/admin/auth/login with missing credentials returns 400+", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send(mockAuthEmpty);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("GET unknown admin path returns 404", async () => {
    const res = await request(app).get("/api/admin/unknown");
    expect(res.statusCode).toBe(404);
  });
});
