import { jest } from "@jest/globals";

const mockFindFirst = jest.fn();
const mockInsertValues = jest.fn();

const mockDb = {
  query: {
    storedImages: { findFirst: mockFindFirst },
  },
  insert: jest.fn().mockReturnValue({
    values: mockInsertValues.mockReturnValue({
      $returningId: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
  }),
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue([
        { id: 1, photoUrl: "image-123.jpg", userId: 1 },
      ]),
    }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));

const imagesServices = await import("../../../services/imagesServices.js");

describe("imagesServices (image storage)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module should load", () => {
    expect(imagesServices).toBeDefined();
  });

  describe("createStoredImage", () => {
    test("creates and returns stored image", async () => {
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { id: 1, photoUrl: "uploads/image-123.jpg", userId: 1 },
          ]),
        }),
      });

      const result = await imagesServices.createStoredImage(1, "uploads/image-123.jpg");

      expect(result).toBeDefined();
      expect(result.photoUrl).toBe("uploads/image-123.jpg");
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("getImageById", () => {
    test("returns image when found", async () => {
      const mockImage = { id: 1, photoUrl: "image.jpg", userId: 1 };
      mockFindFirst.mockResolvedValue(mockImage);

      const result = await imagesServices.getImageById(1, 1);

      expect(result).toEqual(mockImage);
    });

    test("returns null when not found", async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await imagesServices.getImageById(999, 1);

      expect(result).toBeNull();
    });
  });
});
