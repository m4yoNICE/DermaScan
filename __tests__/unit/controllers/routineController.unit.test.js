import { jest } from "@jest/globals";

const mockFetchRoutineProducts = jest.fn();
const mockInsertReminderLog = jest.fn();
const mockFetchReminderLogs = jest.fn();
const mockFetchRoutineSchedule = jest.fn();
const mockInsertUserRoutine = jest.fn();
const mockUpdateUserRoutine = jest.fn();

jest.unstable_mockModule("../../../services/routineServices.js", () => ({
  fetchRoutineProducts: mockFetchRoutineProducts,
  insertReminderLog: mockInsertReminderLog,
  fetchReminderLogs: mockFetchReminderLogs,
  fetchRoutineSchedule: mockFetchRoutineSchedule,
  insertUserRoutine: mockInsertUserRoutine,
  updateUserRoutine: mockUpdateUserRoutine,
}));

const routineController = await import("../../../controllers/routineController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("routineController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRoutineProducts", () => {
    test("returns 200 with products", async () => {
      const mockProducts = [{ id: 1, productName: "Cleanser" }];
      mockFetchRoutineProducts.mockResolvedValue(mockProducts);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await routineController.getRoutineProducts(req, res);

      expect(mockFetchRoutineProducts).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe("completeSchedule", () => {
    test("returns 400 when schedule missing", async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = createResMock();

      await routineController.completeSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Schedule is required" });
      expect(mockInsertReminderLog).not.toHaveBeenCalled();
    });

    test("returns 201 when completed", async () => {
      mockInsertReminderLog.mockResolvedValue(undefined);
      const req = { body: { schedule: "morning" }, user: { id: 1 } };
      const res = createResMock();

      await routineController.completeSchedule(req, res);

      expect(mockInsertReminderLog).toHaveBeenCalledWith(1, "morning");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("getReminderLogs", () => {
    test("returns 200 with logs", async () => {
      const mockLogs = [{ id: 1, schedule: "morning" }];
      mockFetchReminderLogs.mockResolvedValue(mockLogs);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await routineController.getReminderLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });
  });

  describe("getRoutineSchedule", () => {
    test("returns 200 with schedule", async () => {
      const mockSchedule = { morningTime: "08:00", eveningTime: "21:00" };
      mockFetchRoutineSchedule.mockResolvedValue(mockSchedule);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await routineController.getRoutineSchedule(req, res);

      expect(mockFetchRoutineSchedule).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSchedule);
    });
  });

  describe("setUserRoutine", () => {
    test("returns 400 when times missing", async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = createResMock();

      await routineController.setUserRoutine(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Both times are required" });
    });

    test("returns 201 when routine set", async () => {
      const mockRoutine = { morningTime: "08:00", eveningTime: "21:00" };
      mockInsertUserRoutine.mockResolvedValue(mockRoutine);
      const req = {
        body: { morningTime: "08:00", eveningTime: "21:00" },
        user: { id: 1 },
      };
      const res = createResMock();

      await routineController.setUserRoutine(req, res);

      expect(mockInsertUserRoutine).toHaveBeenCalledWith(1, "08:00", "21:00");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRoutine);
    });
  });

  describe("editUserRoutine", () => {
    test("returns 400 when times missing", async () => {
      const req = { body: {}, user: { id: 1 } };
      const res = createResMock();

      await routineController.editUserRoutine(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("returns 200 when routine updated", async () => {
      const mockRoutine = { morningTime: "09:00", eveningTime: "22:00" };
      mockUpdateUserRoutine.mockResolvedValue(mockRoutine);
      const req = {
        body: { morningTime: "09:00", eveningTime: "22:00" },
        user: { id: 1 },
      };
      const res = createResMock();

      await routineController.editUserRoutine(req, res);

      expect(mockUpdateUserRoutine).toHaveBeenCalledWith(1, "09:00", "22:00");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRoutine);
    });
  });
});
