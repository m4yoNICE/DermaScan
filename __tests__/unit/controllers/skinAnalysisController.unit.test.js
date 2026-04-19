import { jest } from "@jest/globals";

const mockAnalyzeSkinOrchestrator = jest.fn();
const mockRecommendOrchestrator = jest.fn();
const mockFetchAnalysisLogsByUser = jest.fn();

jest.unstable_mockModule("../../../application/skinAnalysisOrchestrator.js", () => ({
  analyzeSkinOrchestrator: mockAnalyzeSkinOrchestrator,
}));
jest.unstable_mockModule("../../../application/productRecommendationOrchestrator.js", () => ({
  recommendOrchestrator: mockRecommendOrchestrator,
}));
jest.unstable_mockModule("../../../services/skinAnalysisDBMapping.js", () => ({
  fetchAnalysisLogsByUser: mockFetchAnalysisLogsByUser,
}));

const skinAnalysisController = await import("../../../controllers/skinAnalysisController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("skinAnalysisController (camera/image classification)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("skinAnalysis (image upload + classification)", () => {
    test("returns 400 when no image file uploaded", async () => {
      const req = { user: { id: 1 }, file: null };
      const res = createResMock();

      await skinAnalysisController.skinAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
      expect(mockAnalyzeSkinOrchestrator).not.toHaveBeenCalled();
    });

    test("returns 200 with analysis when classification succeeds", async () => {
      mockAnalyzeSkinOrchestrator.mockResolvedValue({
        statusCode: 200,
        payload: {
          result: "success",
          data: { id: 1, conditionId: 1 },
        },
      });
      mockRecommendOrchestrator.mockResolvedValue({ products: [] });

      const req = {
        user: { id: 1 },
        file: { buffer: Buffer.from("image-data") },
      };
      const res = createResMock();

      await skinAnalysisController.skinAnalysis(req, res);

      expect(mockAnalyzeSkinOrchestrator).toHaveBeenCalledWith(1, req.file.buffer);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          analysis: expect.any(Object),
        })
      );
    });

    test("skips recommendation when analysis fails", async () => {
      mockAnalyzeSkinOrchestrator.mockResolvedValue({
        statusCode: 200,
        payload: { result: "failed", message: "Image unclear" },
      });

      const req = {
        user: { id: 1 },
        file: { buffer: Buffer.from("image-data") },
      };
      const res = createResMock();

      await skinAnalysisController.skinAnalysis(req, res);

      expect(mockRecommendOrchestrator).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("returns 500 on unexpected error", async () => {
      mockAnalyzeSkinOrchestrator.mockRejectedValue(new Error("AI server down"));

      const req = {
        user: { id: 1 },
        file: { buffer: Buffer.from("image-data") },
      };
      const res = createResMock();

      await skinAnalysisController.skinAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAnalysisLogsByUser", () => {
    test("returns 200 with analysis logs", async () => {
      const mockLogs = [{ id: 1, condition: "Acne", status: "success" }];
      mockFetchAnalysisLogsByUser.mockResolvedValue(mockLogs);

      const req = { user: { id: 1 } };
      const res = createResMock();

      await skinAnalysisController.getAnalysisLogsByUser(req, res);

      expect(mockFetchAnalysisLogsByUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });
  });
});
