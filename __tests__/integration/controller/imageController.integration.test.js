import * as imageController from "../../../controllers/imageController.js";
import {
  createMockReq,
  createMockRes,
  mockImageParams,
  mockImageParamsEmpty,
} from "../mockDetails.js";

describe("imageController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq({ params: mockImageParams });
    res = createMockRes();
  });

  test("getImage without image id should handle gracefully", async () => {
    req = createMockReq({ params: mockImageParamsEmpty });
    await imageController.getImage(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getImage with user context should handle requests", async () => {
    req = createMockReq({ params: mockImageParams });
    await imageController.getImage(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
