import { jest } from "@jest/globals";

const mockGetAllAnalysis = jest.fn();
const mockGetAllConditions = jest.fn();

jest.unstable_mockModule(
  "../../../AdminBE/services/analysisServices.js",
  () => ({
    getAllAnalysis: mockGetAllAnalysis,
    getAllConditions: mockGetAllConditions,
  })
);

const analysisController = await import(
  "../../../AdminBE/controllers/analysisController.js"
);

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("adminAnalysisController (reports - view analysis)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleGetAllAnalysis", () => {
    test("returns 200 with analysis report data", async () => {
      const mockAnalysis = [
        {
          id: 1,
          email: "user@test.com",
          conditionName: "Acne",
          status: "success",
          confidenceScores: 0.92,
          createdAt: "2025-03-20T10:00:00Z",
        },
      ];
      mockGetAllAnalysis.mockResolvedValue(mockAnalysis);
      const req = {};
      const res = createResMock();

      await analysisController.handleGetAllAnalysis(req, res);

      expect(mockGetAllAnalysis).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAnalysis);
    });

    test("returns 500 on error", async () => {
      mockGetAllAnalysis.mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = createResMock();

      await analysisController.handleGetAllAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetAllConditions", () => {
    test("returns 200 with conditions report data", async () => {
      const mockConditions = [
        { id: 1, condition: "Acne", canRecommend: "Yes" },
        { id: 2, condition: "Dry Skin", canRecommend: "Yes" },
      ];
      mockGetAllConditions.mockResolvedValue(mockConditions);
      const req = {};
      const res = createResMock();

      await analysisController.handleGetAllConditions(req, res);

      expect(mockGetAllConditions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConditions);
    });

    test("returns 500 on error", async () => {
      mockGetAllConditions.mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = createResMock();

      await analysisController.handleGetAllConditions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
