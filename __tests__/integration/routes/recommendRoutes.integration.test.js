import request from "supertest";
import app from "../../../app.js";
import { mockEndpoints } from "../mockDetails.js";

describe("Recommend routes", () => {
  mockEndpoints.recommend.forEach(({ method, path, body }) => {
    it(`${method.toUpperCase()} ${path} without token returns 401`, async () => {
      const req = request(app)[method](path);
      if (body !== undefined) req.send(body ?? {});
      const res = await req;
      expect(res.statusCode).toBe(401);
    });
  });
});