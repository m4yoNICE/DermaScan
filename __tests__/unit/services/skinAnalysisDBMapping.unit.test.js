import { jest } from "@jest/globals";

const mockFindMany = jest.fn();

const whereLimitChain = {
  limit: jest.fn().mockResolvedValue([{ id: 1, condition: "Acne", canRecommend: "yes" }]),
};
const leftJoinChain = {
  where: jest.fn().mockReturnValue({
    limit: jest.fn().mockResolvedValue([
      {
        id: 1,
        userId: 1,
        conditionId: 1,
        status: "success",
        condition_name: "Acne",
        canRecommend: "yes",
      },
    ]),
  }),
};
const mockFrom = jest.fn().mockReturnValue({
  where: jest.fn().mockReturnValue(whereLimitChain),
  leftJoin: jest.fn().mockReturnValue(leftJoinChain),
});

const mockDb = {
  query: {
    skinAnalysis: { findMany: mockFindMany },
  },
  select: jest.fn().mockReturnValue({ from: mockFrom }),
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      $returningId: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));

const skinAnalysisDBMapping = await import("../../../services/skinAnalysisDBMapping.js");

describe("skinAnalysisDBMapping (classification result mapping)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module should load", () => {
    expect(skinAnalysisDBMapping).toBeDefined();
  });

  describe("mapSkinResultToCatalog", () => {
    test("returns null when skinResult has no top3", async () => {
      const result = await skinAnalysisDBMapping.mapSkinResultToCatalog(1, {});

      expect(result).toBeNull();
    });

    test("returns null when skinResult.top3 is missing", async () => {
      const result = await skinAnalysisDBMapping.mapSkinResultToCatalog(1, { top3: null });

      expect(result).toBeNull();
    });

    test("maps skin result to transaction when condition found", async () => {
      const skinResult = {
        top3: [
          { label: "Acne", score: 0.85 },
          { label: "Eczema", score: 0.1 },
          { label: "Normal", score: 0.05 },
        ],
      };

      const result = await skinAnalysisDBMapping.mapSkinResultToCatalog(1, skinResult);

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
      expect(result.condition_name).toBe("Acne");
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("fetchAnalysisLogsByUser", () => {
    test("returns analysis logs for user", async () => {
      const mockLogs = [{ id: 1, userId: 1, status: "success" }];
      mockFindMany.mockResolvedValue(mockLogs);

      const result = await skinAnalysisDBMapping.fetchAnalysisLogsByUser(1);

      expect(result).toEqual(mockLogs);
    });
  });
});
