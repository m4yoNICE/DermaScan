import { jest } from "@jest/globals";

const mockInsertRecommendations = jest.fn();
const mockFetchHistory = jest.fn();

jest.unstable_mockModule("../../../services/recommendServices.js", () => ({
  insertRecommendations: mockInsertRecommendations,
  fetchHistory: mockFetchHistory,
}));

const recommendController = await import("../../../controllers/recommendController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("recommendController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveRecommendation", () => {
    test("returns 400 when analysisId missing", async () => {
      const req = { body: { productIds: [1, 2] } };
      const res = createResMock();

      await recommendController.saveRecommendation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Analysis records and selected products are required",
      });
      expect(mockInsertRecommendations).not.toHaveBeenCalled();
    });

    test("returns 400 when productIds empty", async () => {
      const req = { body: { analysisId: 1, productIds: [] } };
      const res = createResMock();

      await recommendController.saveRecommendation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("returns 201 when saved successfully", async () => {
      mockInsertRecommendations.mockResolvedValue(undefined);
      const req = { body: { analysisId: 1, productIds: [1, 2, 3] } };
      const res = createResMock();

      await recommendController.saveRecommendation(req, res);

      expect(mockInsertRecommendations).toHaveBeenCalledWith(1, [1, 2, 3]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Recommendations saved.",
      });
    });
  });

  describe("getHistory", () => {
    test("returns 200 with history", async () => {
      const mockHistory = [{ id: 1, condition: "Acne", products: [] }];
      mockFetchHistory.mockResolvedValue(mockHistory);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await recommendController.getHistory(req, res);

      expect(mockFetchHistory).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });
  });
});
