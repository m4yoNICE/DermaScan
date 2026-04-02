import { jest } from "@jest/globals";

const mockFindFirst = jest.fn();
const mockSkinProfileFindFirst = jest.fn();
const mockInsertValues = jest.fn();

const mockDb = {
  query: {
    users: { findFirst: mockFindFirst },
    skinProfile: { findFirst: mockSkinProfileFindFirst },
  },
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
  insert: jest.fn().mockReturnValue({
    values: mockInsertValues.mockReturnValue({
      $returningId: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
  }),
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      leftJoin: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          {
            userId: 1,
            firstName: "John",
            lastName: "Doe",
            email: "user@example.com",
            birthdate: "1990-01-15",
            skinType: "oily",
            skinSensitivity: "sensitive",
            pigmentation: "pigmented",
            aging: "tight",
          },
        ]),
      }),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockResolvedValue({ affectedRows: 1 }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));
jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue("hashed-password"),
  },
}));

const userServices = await import("../../../services/userServices.js");
const bcrypt = (await import("bcryptjs")).default;

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.query.users.findFirst = mockFindFirst;
    mockDb.query.skinProfile.findFirst = mockSkinProfileFindFirst;
  });

  test("service module should load", () => {
    expect(userServices).toBeDefined();
  });

  describe("updateUser (update profile)", () => {
    const mockUser = {
      id: 1,
      email: "user@example.com",
      firstName: "Old",
      lastName: "Name",
      birthdate: "1990-01-15",
      password: "hashed-old-pass",
    };

    test("returns success when updating firstname and lastname", async () => {
      mockFindFirst.mockResolvedValue(mockUser);

      const result = await userServices.updateUser(
        1,
        "NewFirst",
        "NewLast",
        undefined,
        undefined,
        undefined
      );

      expect(result).toEqual({ success: true });
      expect(mockFindFirst).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
    });

    test("returns success when updating birthdate only", async () => {
      mockFindFirst.mockResolvedValue(mockUser);

      const result = await userServices.updateUser(
        1,
        undefined,
        undefined,
        "1995-06-20",
        undefined,
        undefined
      );

      expect(result).toEqual({ success: true });
    });

    test("returns user not found when user does not exist", async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await userServices.updateUser(
        999,
        "New",
        "Name",
        undefined,
        undefined,
        undefined
      );

      expect(result).toEqual({ success: false, message: "User not found" });
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    test("returns error when newPassword provided without currentPassword", async () => {
      mockFindFirst.mockResolvedValue(mockUser);

      const result = await userServices.updateUser(
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        "newpass123"
      );

      expect(result).toEqual({
        success: false,
        message: "Current password required",
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test("returns error when current password is incorrect", async () => {
      mockFindFirst.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await userServices.updateUser(
        1,
        undefined,
        undefined,
        undefined,
        "wrongpass",
        "newpass123"
      );

      expect(result).toEqual({
        success: false,
        message: "Incorrect current password",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashed-old-pass");
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test("returns success when password is updated with correct current password", async () => {
      mockFindFirst.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userServices.updateUser(
        1,
        undefined,
        undefined,
        undefined,
        "currentpass",
        "newpass123"
      );

      expect(result).toEqual({ success: true });
      expect(bcrypt.compare).toHaveBeenCalledWith("currentpass", "hashed-old-pass");
      expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", 10);
    });
  });

  describe("createSkinData (skin type questionnaire)", () => {
    const mockSkinProfile = {
      id: 1,
      userId: 1,
      skinType: "oily",
      skinSensitivity: "sensitive",
      pigmentation: "pigmented",
      aging: "tight",
    };

    test("creates skin profile with questionnaire data", async () => {
      mockSkinProfileFindFirst.mockResolvedValue(mockSkinProfile);

      const result = await userServices.createSkinData(
        1,
        "oily",
        "sensitive",
        "pigmented",
        "tight"
      );

      expect(result).toEqual(mockSkinProfile);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockSkinProfileFindFirst).toHaveBeenCalled();
    });

    test("passes correct values to insert", async () => {
      mockSkinProfileFindFirst.mockResolvedValue(mockSkinProfile);

      await userServices.createSkinData(1, "dry", "resistant", "non-pigmented", "wrinkled");

      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          skinType: "dry",
          skinSensitivity: "resistant",
          pigmentation: "non-pigmented",
          aging: "wrinkled",
        })
      );
    });
  });

  describe("getUserWithSkinData", () => {
    test("returns user with skin profile data", async () => {
      const result = await userServices.getUserWithSkinData(1);

      expect(result).toBeDefined();
      expect(result.userId).toBe(1);
      expect(result.skinType).toBe("oily");
      expect(result.skinSensitivity).toBe("sensitive");
      expect(result.pigmentation).toBe("pigmented");
      expect(result.aging).toBe("tight");
    });

    test("returns null when user has no skin data", async () => {
      const originalSelect = mockDb.select;
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await userServices.getUserWithSkinData(999);

      expect(result).toBeNull();
      mockDb.select = originalSelect;
    });
  });

  describe("deleteUser (account deletion)", () => {
    test("returns true when user is deleted", async () => {
      const result = await userServices.deleteUser(1);

      expect(result).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    test("returns false when user not found", async () => {
      const originalDelete = mockDb.delete;
      mockDb.delete = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue({ affectedRows: 0 }),
      });

      const result = await userServices.deleteUser(999);

      expect(result).toBe(false);
      mockDb.delete = originalDelete;
    });
  });

  describe("deleteSkinData", () => {
    test("returns true when skin data is deleted", async () => {
      const result = await userServices.deleteSkinData(1);

      expect(result).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    test("returns false when no rows affected", async () => {
      const originalDelete = mockDb.delete;
      mockDb.delete = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue({ affectedRows: 0 }),
      });

      const result = await userServices.deleteSkinData(999);

      expect(result).toBe(false);
      mockDb.delete = originalDelete;
    });
  });
});