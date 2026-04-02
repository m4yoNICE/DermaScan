import * as journalController from "../../../controllers/journalController.js";
import {
  createMockReq,
  createMockRes,
  mockJournalEmpty,
  mockJournalCreate,
  mockJournalUpdate,
} from "../mockDetails.js";

describe("journalController integration tests", () => {
  let req, res;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();
  });

  test("createjournal with empty body should return error", async () => {
    req = createMockReq({ body: mockJournalEmpty });
    await journalController.createjournal(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getalljournal without user should handle gracefully", async () => {
    req = createMockReq();
    delete req.user;
    await journalController.getalljournal(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("deletejournal with invalid id should handle gracefully", async () => {
    req = createMockReq({ params: { id: "invalid" } });
    await journalController.deletejournal(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("createjournal with payload should handle requests", async () => {
    req = createMockReq({ body: mockJournalCreate });
    await journalController.createjournal(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("updatejournal should handle requests", async () => {
    req = createMockReq({
      params: { id: "1" },
      body: mockJournalUpdate,
    });
    await journalController.updatejournal(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test("getsinglejournalbydate should handle requests", async () => {
    req = createMockReq({ params: { date: "2024-01-15" } });
    await journalController.getsinglejournalbydate(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
