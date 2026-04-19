import request from "supertest";
import app from "../../../app.js";
import { mockEndpoints } from "../mockDetails.js";

describe("Skin analysis endpoint", () => {
  it("POST /api/conditions/skin without token returns 401", async () => {
    const { method, path } = mockEndpoints.conditions;
    const res = await request(app)[method](path);
    expect(res.statusCode).toBe(401);
  });

  it("GET invalid conditions route should return 404", async () => {
    const res = await request(app).get("/api/conditions/invalid");
    expect(res.statusCode).toBe(404);
  });
});
