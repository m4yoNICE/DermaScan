import { jest } from "@jest/globals";

const mockCheckImgPython = jest.fn();
const mockSkinAnalyze = jest.fn();
const mockCreateStoredImage = jest.fn();
const mockMapSkinResultToCatalog = jest.fn();
const mockSaveBufferImage = jest.fn();

jest.unstable_mockModule("../../../utils/python.checkImageQuality.js", () => ({
  checkImgPython: mockCheckImgPython,
}));
jest.unstable_mockModule("../../../utils/python.serverSkinAnalysis.js", () => ({
  skinAnalyze: mockSkinAnalyze,
}));
jest.unstable_mockModule("../../../services/imagesServices.js", () => ({
  createStoredImage: mockCreateStoredImage,
}));
jest.unstable_mockModule("../../../utils/saveBufferImage.js", () => ({
  saveBufferImage: mockSaveBufferImage,
}));
const mockGetTransactionWithCondition = jest.fn();
jest.unstable_mockModule("../../../services/skinAnalysisDBMapping.js", () => ({
  mapSkinResultToCatalog: mockMapSkinResultToCatalog,
  getTransactionWithCondition: mockGetTransactionWithCondition,
}));
jest.unstable_mockModule("../../../config/db.js", () => ({
  db: { update: jest.fn().mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) }) }) },
}));

const { analyzeSkinOrchestrator } = await import(
  "../../../application/skinAnalysisOrchestrator.js"
);

describe("skinAnalysisOrchestrator (image classification/recognition)", () => {
  const mockBuffer = Buffer.from("fake-image-data");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("image quality check (camera/upload validation)", () => {
    test("returns failed when image quality is poor", async () => {
      mockCheckImgPython.mockResolvedValue({ ok: false });

      const result = await analyzeSkinOrchestrator(1, mockBuffer);

      expect(result.statusCode).toBe(200);
      expect(result.payload.result).toBe("failed");
      expect(result.payload.message).toMatch(/unclear|retake/);
      expect(mockSkinAnalyze).not.toHaveBeenCalled();
    });
  });

  describe("skin classification (image recognition)", () => {
    test("returns success when AI classifies skin condition", async () => {
      const fullTransaction = {
        id: 1,
        userId: 1,
        imageId: 1,
        conditionId: 1,
        confidenceScores: 0.85,
        status: "success",
        condition_name: "Acne",
        canRecommend: "yes",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };
      mockCheckImgPython.mockResolvedValue({ ok: true });
      mockMapSkinResultToCatalog.mockResolvedValue(fullTransaction);
      mockGetTransactionWithCondition.mockResolvedValue(fullTransaction);
      mockSaveBufferImage.mockResolvedValue("image-123.jpg");
      mockCreateStoredImage.mockResolvedValue({ id: 1, photoUrl: "image-123.jpg" });

      const skinResult = {
        top3: [
          { label: "Acne", score: 0.85 },
          { label: "Eczema", score: 0.1 },
          { label: "Normal", score: 0.05 },
        ],
      };
      mockSkinAnalyze.mockResolvedValue(skinResult);

      const result = await analyzeSkinOrchestrator(1, mockBuffer);

      expect(result.statusCode).toBe(200);
      expect(result.payload.result).toBe("success");
      expect(result.payload.data.condition_name).toBe("Acne");
      expect(mockSkinAnalyze).toHaveBeenCalledWith(mockBuffer);
    });

    test("returns flagged when medical concern detected", async () => {
      mockCheckImgPython.mockResolvedValue({ ok: true });
      mockMapSkinResultToCatalog.mockResolvedValue({
        id: 1,
        status: "flagged",
        condition_name: "Melanoma",
        canRecommend: "no",
      });

      mockSkinAnalyze.mockResolvedValue({
        top3: [
          { label: "Melanoma", score: 0.9 },
          { label: "Mole", score: 0.05 },
          { label: "Normal", score: 0.05 },
        ],
      });

      const result = await analyzeSkinOrchestrator(1, mockBuffer);

      expect(result.payload.result).toBe("flagged");
      expect(result.payload.message).toMatch(/professional consultation/);
    });

    test("returns out of scope when non-skin detected", async () => {
      mockCheckImgPython.mockResolvedValue({ ok: true });
      mockMapSkinResultToCatalog.mockResolvedValue({
        id: 1,
        status: "out of scope",
      });

      mockSkinAnalyze.mockResolvedValue({
        top3: [
          { label: "Not skin", score: 0.4 },
          { label: "Other", score: 0.35 },
          { label: "Unknown", score: 0.25 },
        ],
      });

      const result = await analyzeSkinOrchestrator(1, mockBuffer);

      expect(result.payload.result).toBe("failed");
      expect(result.payload.message).toMatch(/does not contain skin/);
    });

    test("returns 404 when mapping fails", async () => {
      mockCheckImgPython.mockResolvedValue({ ok: true });
      mockSkinAnalyze.mockResolvedValue({ top3: [{ label: "Acne", score: 0.9 }] });
      mockMapSkinResultToCatalog.mockResolvedValue(null);

      const result = await analyzeSkinOrchestrator(1, mockBuffer);

      expect(result.statusCode).toBe(404);
      expect(result.payload.error).toBeDefined();
    });
  });
});
