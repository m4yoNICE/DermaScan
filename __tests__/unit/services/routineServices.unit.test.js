import { jest } from "@jest/globals";

const mockFindFirst = jest.fn();
const mockLimit = jest.fn().mockResolvedValue([]);

let fromCallCount = 0;
const mockFrom = jest.fn().mockImplementation(() => {
  fromCallCount++;
  if (fromCallCount === 1) {
    return { where: jest.fn().mockReturnValue({ orderBy: jest.fn().mockReturnValue({ limit: mockLimit }) }) };
  }
  if (fromCallCount === 2) {
    return { where: jest.fn().mockResolvedValue([{ morningTime: "08:00", eveningTime: "21:00" }]) };
  }
  return { where: jest.fn().mockResolvedValue([{ id: 1, userId: 1, schedule: "morning" }]) };
});

const mockDb = {
  query: {
    userRoutine: { findFirst: mockFindFirst },
  },
  select: jest.fn().mockReturnValue({ from: mockFrom }),
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(undefined),
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
};

const mockGetInstructions = jest.fn().mockReturnValue("Apply as directed.");

jest.unstable_mockModule("../../../config/db.js", () => ({ db: mockDb }));
jest.unstable_mockModule("../../../utils/routineInstructions.js", () => ({
  getInstructions: mockGetInstructions,
}));

const routineServices = await import("../../../services/routineServices.js");

describe("routineServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fromCallCount = 0;
  });

  test("module should load", () => {
    expect(routineServices).toBeDefined();
  });

  describe("fetchRoutineProducts", () => {
    test("returns empty array when no analysis", async () => {
      mockLimit.mockResolvedValueOnce([]);

      const result = await routineServices.fetchRoutineProducts(1);

      expect(result).toEqual([]);
    });
  });

  describe("fetchRoutineSchedule", () => {
    test("returns schedule when found", async () => {
      mockFrom.mockReturnValueOnce({
        where: jest.fn().mockResolvedValue([{ morningTime: "08:00", eveningTime: "21:00" }]),
      });

      const result = await routineServices.fetchRoutineSchedule(1);

      expect(result).toEqual({ morningTime: "08:00", eveningTime: "21:00" });
    });

    test("returns null when not found", async () => {
      mockFindFirst.mockResolvedValue(undefined);

      const result = await routineServices.fetchRoutineSchedule(999);

      expect(result).toBeNull();
    });
  });

  describe("insertReminderLog", () => {
    test("inserts reminder log", async () => {
      await routineServices.insertReminderLog(1, "morning");

      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("fetchReminderLogs", () => {
    test("returns reminder logs", async () => {
      const mockLogs = [{ id: 1, userId: 1, schedule: "morning" }];
      mockFrom.mockReturnValueOnce({
        where: jest.fn().mockResolvedValue(mockLogs),
      });

      const result = await routineServices.fetchReminderLogs(1);

      expect(result).toEqual(mockLogs);
    });
  });

  describe("insertUserRoutine", () => {
    test("inserts and returns routine", async () => {
      const mockRoutine = { id: 1, morningTime: "08:00", eveningTime: "21:00" };
      mockFindFirst.mockResolvedValue(mockRoutine);

      const result = await routineServices.insertUserRoutine(1, "08:00", "21:00");

      expect(result).toEqual(mockRoutine);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("updateUserRoutine", () => {
    test("updates and returns routine", async () => {
      const mockRoutine = { id: 1, morningTime: "09:00", eveningTime: "22:00" };
      mockFindFirst.mockResolvedValue(mockRoutine);

      const result = await routineServices.updateUserRoutine(1, "09:00", "22:00");

      expect(result).toEqual(mockRoutine);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });
});
