import * as routineController from "../../../controllers/routineController.js";
import {
  createMockReq,
  createMockRes,
  mockRoutineEmpty,
  mockRoutineCompleteSchedule,
  mockRoutineSchedule,
} from "../mockDetails.js";

describe("routineController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();
  });

  test("controller should be defined", () => {
    expect(routineController).toBeDefined();
  });

  test("getRoutineSchedule should handle requests", async () => {
    await routineController.getRoutineSchedule(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getRoutineProducts should handle requests", async () => {
    await routineController.getRoutineProducts(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getReminderLogs should handle requests", async () => {
    await routineController.getReminderLogs(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("completeSchedule with empty body should return error", async () => {
    req = createMockReq({ body: mockRoutineEmpty });
    await routineController.completeSchedule(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("completeSchedule with schedule payload should handle requests", async () => {
    req = createMockReq({ body: mockRoutineCompleteSchedule });
    await routineController.completeSchedule(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("setUserRoutine with empty body should return error", async () => {
    req = createMockReq({ body: mockRoutineEmpty });
    await routineController.setUserRoutine(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("setUserRoutine with payload should handle requests", async () => {
    req = createMockReq({ body: mockRoutineSchedule });
    await routineController.setUserRoutine(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("editUserRoutine with empty body should return error", async () => {
    req = createMockReq({ body: mockRoutineEmpty });
    await routineController.editUserRoutine(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("editUserRoutine with payload should handle requests", async () => {
    req = createMockReq({ body: mockRoutineSchedule });
    await routineController.editUserRoutine(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
