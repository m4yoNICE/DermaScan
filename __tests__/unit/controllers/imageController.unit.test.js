import { jest } from "@jest/globals";

const mockGetImageById = jest.fn();

jest.unstable_mockModule("../../../services/imagesServices.js", () => ({
  getImageById: mockGetImageById,
}));

const imageController = await import("../../../controllers/imageController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("imageController (image retrieval)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getImage", () => {
    test("returns 200 with filename when image found", async () => {
      mockGetImageById.mockResolvedValue({
        id: 1,
        photoUrl: "skinUploads/image-123.jpg",
        userId: 1,
      });

      const req = { user: { id: 1 }, params: { id: 1 } };
      const res = createResMock();

      await imageController.getImage(req, res);

      expect(mockGetImageById).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith("image-123.jpg");
    });

    test("returns 404 when image not found", async () => {
      mockGetImageById.mockResolvedValue(null);

      const req = { user: { id: 1 }, params: { id: 999 } };
      const res = createResMock();

      await imageController.getImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Image not found" });
    });
  });
});
