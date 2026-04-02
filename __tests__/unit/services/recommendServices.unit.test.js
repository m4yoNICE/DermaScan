import { jest } from "@jest/globals";

const mockInsertValues = jest.fn();
const mockSelectFrom = jest.fn();

const mockDb = {
  insert: jest.fn().mockReturnValue({
    values: mockInsertValues.mockResolvedValue(undefined),
  }),
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      leftJoin: jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue([
                  {
                    analysisId: 1,
                    createdAt: "2024-01-15T10:00:00",
                    status: "completed",
                    condition: "Acne",
                    productId: 1,
                    productName: "Product 1",
                  },
                ]),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));

const recommendServices = await import("../../../services/recommendServices.js");

describe("recommendServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module should load", () => {
    expect(recommendServices).toBeDefined();
  });

  describe("insertRecommendations", () => {
    test("inserts recommendations", async () => {
      await recommendServices.insertRecommendations(1, [1, 2, 3]);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockInsertValues).toHaveBeenCalledWith([
        { analysisId: 1, productId: 1 },
        { analysisId: 1, productId: 2 },
        { analysisId: 1, productId: 3 },
      ]);
    });
  });

  describe("fetchHistory", () => {
    test("returns grouped history for user", async () => {
      const result = await recommendServices.fetchHistory(1);

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
