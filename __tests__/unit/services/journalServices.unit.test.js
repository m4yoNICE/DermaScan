import { jest } from "@jest/globals";

const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockInsertValues = jest.fn();

const mockDb = {
  query: {
    journals: {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
    },
  },
  insert: jest.fn().mockReturnValue({
    values: mockInsertValues.mockReturnValue({
      $returningId: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockResolvedValue({ affectedRows: 1 }),
  }),
};

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));

const journalServices = await import("../../../services/journalServices.js");

describe("journalServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module should load", () => {
    expect(journalServices).toBeDefined();
  });

  describe("getAllJournal", () => {
    test("returns journals for user", async () => {
      const mockJournals = [{ id: 1, journalText: "Entry 1", journalDate: "2024-01-01" }];
      mockFindMany.mockResolvedValue(mockJournals);

      const result = await journalServices.getAllJournal(1);

      expect(result).toEqual(mockJournals);
      expect(mockFindMany).toHaveBeenCalled();
    });
  });

  describe("getSingleJournalByDate", () => {
    test("returns journal when found", async () => {
      const mockJournal = { id: 1, journalText: "Today", journalDate: "2024-01-15" };
      mockFindFirst.mockResolvedValue(mockJournal);

      const result = await journalServices.getSingleJournalByDate(1, "2024-01-15");

      expect(result).toEqual(mockJournal);
    });

    test("returns undefined when not found", async () => {
      mockFindFirst.mockResolvedValue(undefined);

      const result = await journalServices.getSingleJournalByDate(1, "2024-99-99");

      expect(result).toBeUndefined();
    });
  });

  describe("createJournal", () => {
    test("creates and returns journal", async () => {
      const mockJournal = { id: 1, journalText: "New entry", journalDate: "2024-01-20" };
      mockFindFirst.mockResolvedValue(mockJournal);

      const result = await journalServices.createJournal(1, "New entry", "2024-01-20");

      expect(result).toEqual(mockJournal);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("updateJournal", () => {
    test("updates and returns journal", async () => {
      const mockJournal = { id: 1, journalText: "Updated text", journalDate: "2024-01-20" };
      mockFindFirst.mockResolvedValue(mockJournal);

      const result = await journalServices.updateJournal(1, 1, "Updated text");

      expect(result).toEqual(mockJournal);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("deleteJournal", () => {
    test("returns true when journal deleted", async () => {
      const result = await journalServices.deleteJournal(1, 1);

      expect(result).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    test("returns false when no rows affected", async () => {
      const originalDelete = mockDb.delete;
      mockDb.delete = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue({ affectedRows: 0 }),
      });

      const result = await journalServices.deleteJournal(1, 999);

      expect(result).toBe(false);
      mockDb.delete = originalDelete;
    });
  });
});
