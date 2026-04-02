import { jest } from "@jest/globals";

const mockGetAllJournal = jest.fn();
const mockGetSingleJournalByDate = jest.fn();
const mockCreateJournal = jest.fn();
const mockUpdateJournal = jest.fn();
const mockDeleteJournal = jest.fn();

jest.unstable_mockModule("../../../services/journalServices.js", () => ({
  getAllJournal: mockGetAllJournal,
  getSingleJournalByDate: mockGetSingleJournalByDate,
  createJournal: mockCreateJournal,
  updateJournal: mockUpdateJournal,
  deleteJournal: mockDeleteJournal,
}));

const journalController = await import("../../../controllers/journalController.js");

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("journalController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getalljournal", () => {
    test("returns 200 with journals", async () => {
      const mockJournals = [{ id: 1, journalText: "Entry", journalDate: "2024-01-01" }];
      mockGetAllJournal.mockResolvedValue(mockJournals);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await journalController.getalljournal(req, res);

      expect(mockGetAllJournal).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJournals);
    });
  });

  describe("getsinglejournalbydate", () => {
    test("returns 200 with journal when found", async () => {
      const mockJournal = { id: 1, journalText: "Today", journalDate: "2024-01-15" };
      mockGetSingleJournalByDate.mockResolvedValue(mockJournal);
      const req = { user: { id: 1 }, params: { date: "2024-01-15" } };
      const res = createResMock();

      await journalController.getsinglejournalbydate(req, res);

      expect(mockGetSingleJournalByDate).toHaveBeenCalledWith(1, "2024-01-15");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJournal);
    });

    test("returns 200 with data null when not found", async () => {
      mockGetSingleJournalByDate.mockResolvedValue(null);
      const req = { user: { id: 1 }, params: { date: "2024-99-99" } };
      const res = createResMock();

      await journalController.getsinglejournalbydate(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: null });
    });
  });

  describe("createjournal", () => {
    test("returns 200 when journal created", async () => {
      const mockJournal = { id: 1, journalText: "New", journalDate: "2024-01-20" };
      mockCreateJournal.mockResolvedValue(mockJournal);
      const req = {
        user: { id: 1 },
        body: { journalText: "New", journalDate: "2024-01-20" },
      };
      const res = createResMock();

      await journalController.createjournal(req, res);

      expect(mockCreateJournal).toHaveBeenCalledWith(1, "New", "2024-01-20");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJournal);
    });
  });

  describe("updatejournal", () => {
    test("returns 200 when journal updated", async () => {
      const mockJournal = { id: 1, journalText: "Updated" };
      mockUpdateJournal.mockResolvedValue(mockJournal);
      const req = {
        user: { id: 1 },
        params: { id: 1 },
        body: { journalText: "Updated" },
      };
      const res = createResMock();

      await journalController.updatejournal(req, res);

      expect(mockUpdateJournal).toHaveBeenCalledWith(1, 1, "Updated");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("returns 404 when journal not found", async () => {
      mockUpdateJournal.mockResolvedValue(null);
      const req = { user: { id: 1 }, params: { id: 999 }, body: { journalText: "x" } };
      const res = createResMock();

      await journalController.updatejournal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Journal not found" });
    });
  });

  describe("deletejournal", () => {
    test("returns 200 when journal deleted", async () => {
      mockDeleteJournal.mockResolvedValue(true);
      const req = { user: { id: 1 }, params: { id: 1 } };
      const res = createResMock();

      await journalController.deletejournal(req, res);

      expect(mockDeleteJournal).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Journal deleted successfully" });
    });

    test("returns 404 when journal not found", async () => {
      mockDeleteJournal.mockResolvedValue(false);
      const req = { user: { id: 1 }, params: { id: 999 } };
      const res = createResMock();

      await journalController.deletejournal(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Journal not found" });
    });
  });
});
