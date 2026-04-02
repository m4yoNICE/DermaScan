import { jest } from "@jest/globals";

const mockDb = {
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { skinType: "oily", skinSensitivity: "sensitive", pigmentation: "pigmented", aging: "tight" },
        ]),
      }),
      innerJoin: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          { id: 1, productName: "Product 1", skinType: "oily, sensitive" },
        ]),
      }),
    }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));

const productRecommendationServices = await import(
  "../../../services/productRecommendationServices.js"
);

describe("productRecommendationServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module should load", () => {
    expect(productRecommendationServices).toBeDefined();
  });

  describe("getSkinData", () => {
    test("returns skin profile for user", async () => {
      const result = await productRecommendationServices.getSkinData(1);

      expect(result).toBeDefined();
      expect(result.skinType).toBe("oily");
      expect(result.skinSensitivity).toBe("sensitive");
    });
  });

  describe("matchProductByCondition", () => {
    test("returns products for condition", async () => {
      const result = await productRecommendationServices.matchProductByCondition(1);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("filterBySkinType (pure function)", () => {
    test("filters products by skin type", () => {
      const products = [
        { id: 1, skinType: "oily, sensitive, pigmented" },
        { id: 2, skinType: "dry, resistant" },
      ];
      const userSkin = { skinType: "oily", skinSensitivity: null, pigmentation: null, aging: null };

      const result = productRecommendationServices.filterBySkinType(products, userSkin);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("returns empty when no match", () => {
      const products = [{ id: 1, skinType: "dry" }];
      const userSkin = { skinType: "oily", skinSensitivity: null, pigmentation: null, aging: null };

      const result = productRecommendationServices.filterBySkinType(products, userSkin);

      expect(result).toHaveLength(0);
    });
  });

  describe("scoreProducts (pure function)", () => {
    test("adds score and sorts by highest", () => {
      const products = [
        { id: 1, dermaTested: false, locality: "Philippines" },
        { id: 2, dermaTested: true, locality: "US" },
      ];

      const result = productRecommendationServices.scoreProducts(products);

      expect(result[0].score).toBeDefined();
      expect(result[0].id).toBe(2);
      expect(result[0].score).toBe(50);
    });

    test("adds locality bonus for Philippines", () => {
      const products = [{ id: 1, dermaTested: false, locality: "Philippines" }];

      const result = productRecommendationServices.scoreProducts(products);

      expect(result[0].score).toBe(30);
    });
  });
});
