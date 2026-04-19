import request from "supertest";
import app from "../../../app.js";
import { mockEndpoints } from "../mockDetails.js";

describe("Routine routes authentication", () => {
  it("GET /api/routines/schedule without token returns 401", async () => {
    const { method, path } = mockEndpoints.routine;
    const res = await request(app)[method](path);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Access Denied");
  });
});
