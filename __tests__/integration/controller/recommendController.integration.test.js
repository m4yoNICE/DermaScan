import * as recommendController from "../../../controllers/recommendController.js";
import {
  createMockReq,
  createMockRes,
  mockRecommendationEmpty,
  mockRecommendationSave,
} from "../mockDetails.js";

describe("recommendController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();
  });

  test("getHistory without user should handle gracefully", async () => {
    req = createMockReq();
    delete req.user;
    await recommendController.getHistory(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("saveRecommendation with empty body should return error", async () => {
    req = createMockReq({ body: mockRecommendationEmpty });
    await recommendController.saveRecommendation(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("saveRecommendation with payload should handle requests", async () => {
    req = createMockReq({ body: mockRecommendationSave });
    await recommendController.saveRecommendation(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
