import request from "supertest";
import app from "../../../app.js";
import { mockEndpoints } from "../mockDetails.js";

describe("Image routes", () => {
  it("GET /api/images/:id without token returns 401", async () => {
    const { method, path } = mockEndpoints.image;
    const res = await request(app)[method](path);
    expect(res.statusCode).toBe(401);
  });
});