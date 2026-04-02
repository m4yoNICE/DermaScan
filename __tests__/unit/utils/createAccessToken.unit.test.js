import jwt from "jsonwebtoken";
import { createAccessToken } from "../../../utils/createAccessToken.js";

process.env.JWT_SECRET = "test_secret";

describe("createAccessToken", () => {

  test("should generate a JWT token", async () => {
    const payload = { id: 10 };

    const token = await createAccessToken(payload, "1h");

    expect(typeof token).toBe("string");
  });

  test("should encode payload correctly", async () => {
    const payload = { id: 25, role: "user" };

    const token = await createAccessToken(payload);

    const decoded = jwt.decode(token);

    expect(decoded.id).toBe(25);
    expect(decoded.role).toBe("user");
  });

  test("should respect expiration parameter", async () => {
    const payload = { id: 1 };

    const token = await createAccessToken(payload, "1h");

    const decoded = jwt.decode(token);

    expect(decoded.exp).toBeDefined();
  });

});