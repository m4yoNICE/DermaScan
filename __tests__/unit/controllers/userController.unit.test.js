import { jest } from "@jest/globals";

const mockGetUserWithSkinData = jest.fn();
const mockCreateSkinData = jest.fn();
const mockDeleteUser = jest.fn();
const mockFetchRoutineSchedule = jest.fn();

jest.unstable_mockModule("../../../services/userServices.js", () => ({
  updateUser: jest.fn(),
  deleteUser: mockDeleteUser,
  getUserWithSkinData: mockGetUserWithSkinData,
  createSkinData: mockCreateSkinData,
  deleteSkinData: jest.fn(),
}));
jest.unstable_mockModule("../../../services/routineServices.js", () => ({
  fetchRoutineSchedule: mockFetchRoutineSchedule,
}));

const userController = await import("../../../controllers/userController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("service module should load", () => {
    expect(userController).toBeDefined();
  });

  describe("createskindata (skin type questionnaire)", () => {
    test("returns 400 when skin_type is missing", async () => {
      const req = {
        body: { skin_sensitivity: "sensitive", pigmentation: "pigmented", aging: "tight" },
        user: { id: 1 },
      };
      const res = createResMock();

      await userController.createskindata(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
      expect(mockCreateSkinData).not.toHaveBeenCalled();
    });

    test("returns 400 when skin_sensitivity is missing", async () => {
      const req = {
        body: { skin_type: "oily", pigmentation: "pigmented", aging: "tight" },
        user: { id: 1 },
      };
      const res = createResMock();

      await userController.createskindata(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
      expect(mockCreateSkinData).not.toHaveBeenCalled();
    });

    test("returns 200 when questionnaire data is valid", async () => {
      mockCreateSkinData.mockResolvedValue({ id: 1, skinType: "oily" });
      const req = {
        body: {
          skin_type: "oily",
          skin_sensitivity: "sensitive",
          pigmentation: "pigmented",
          aging: "tight",
        },
        user: { id: 1 },
      };
      const res = createResMock();

      await userController.createskindata(req, res);

      expect(mockCreateSkinData).toHaveBeenCalledWith(
        1,
        "oily",
        "sensitive",
        "pigmented",
        "tight"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Skin data added successfully",
      });
    });

    test("accepts skin_sensitivity of 0 (falsy but valid)", async () => {
      mockCreateSkinData.mockResolvedValue({ id: 1 });
      const req = {
        body: {
          skin_type: "dry",
          skin_sensitivity: 0,
          pigmentation: "non-pigmented",
          aging: "wrinkled",
        },
        user: { id: 1 },
      };
      const res = createResMock();

      await userController.createskindata(req, res);

      expect(mockCreateSkinData).toHaveBeenCalledWith(1, "dry", 0, "non-pigmented", "wrinkled");
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteuser (account deletion)", () => {
    test("returns 200 when account is successfully deleted", async () => {
      mockDeleteUser.mockResolvedValue(true);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await userController.deleteuser(req, res);

      expect(mockDeleteUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    test("returns 404 when user not found", async () => {
      mockDeleteUser.mockResolvedValue(false);
      const req = { user: { id: 999 } };
      const res = createResMock();

      await userController.deleteuser(req, res);

      expect(mockDeleteUser).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    test("returns 500 when delete fails with error", async () => {
      mockDeleteUser.mockRejectedValue(new Error("Database error"));
      const req = { user: { id: 1 } };
      const res = createResMock();

      await userController.deleteuser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});