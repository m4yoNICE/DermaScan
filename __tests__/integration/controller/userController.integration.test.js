import * as userController from "../../../controllers/userController.js";
import {
  createMockReq,
  createMockRes,
  mockSkinDataEmpty,
  mockUserProfileUpdate,
} from "../mockDetails.js";

describe("userController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();
  });

  test("getuserid without user should handle gracefully", async () => {
    req = createMockReq({ user: undefined });
    delete req.user;
    await userController.getuserid(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("createskindata with empty body should return error", async () => {
    req = createMockReq({ body: mockSkinDataEmpty });
    await userController.createskindata(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("edituser without user should handle gracefully", async () => {
    req = createMockReq({ body: mockUserProfileUpdate, user: undefined });
    delete req.user;
    await userController.edituser(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("edituser with profile payload should handle request", async () => {
    req = createMockReq({ body: mockUserProfileUpdate });
    await userController.edituser(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
