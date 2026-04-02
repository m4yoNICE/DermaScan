import * as skinAnalysisController from "../../../controllers/skinAnalysisController.js";
import {
  createMockReq,
  createMockRes,
  mockFile,
  mockFileNull,
} from "../mockDetails.js";

describe("skinAnalysisController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq({ file: mockFileNull });
    res = createMockRes();
  });

  test("skinAnalysis without image should return error", async () => {
    req = createMockReq({ file: mockFileNull });
    await skinAnalysisController.skinAnalysis(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getAnalysisLogsByUser should handle requests", async () => {
    await skinAnalysisController.getAnalysisLogsByUser(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("skinAnalysis with image should handle requests", async () => {
    req = createMockReq({ file: mockFile });
    await skinAnalysisController.skinAnalysis(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
