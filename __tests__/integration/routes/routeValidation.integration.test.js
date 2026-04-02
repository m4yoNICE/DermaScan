import request from "supertest";
import app from "../../../app.js";

describe("Conditions analyze endpoint", () => {
  it("should return 404 for invalid route", async () => {
    const res = await request(app).post("/api/conditions/analyze");
    expect(res.statusCode).toBe(404);
  });
});
