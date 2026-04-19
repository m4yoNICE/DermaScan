import { jest } from "@jest/globals";

const mockGetScanPerDay = jest.fn();
const mockGetOutOfScopeStatistics = jest.fn();
const mockDeleteOutOfScope = jest.fn();

jest.unstable_mockModule(
  "../../../AdminBE/services/outOfScopeServices.js",
  () => ({
    getScanPerDay: mockGetScanPerDay,
    getOutOfScopeStatistics: mockGetOutOfScopeStatistics,
    deleteOutOfScope: mockDeleteOutOfScope,
  })
);

const outOfScopeController = await import(
  "../../../AdminBE/controllers/outOfScopeController.js"
);

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("adminOutOfScopeController (reports - scans & out-of-scope stats)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleGetScanPerDay (view scans report)", () => {
    test("returns 200 with scans per day data", async () => {
      const mockRes = createResMock();
      mockGetScanPerDay.mockImplementation(async (req, res) => {
        res.status(200).json([
          { date: "2025-03-20", count: 15 },
          { date: "2025-03-21", count: 22 },
        ]);
      });

      const req = {};
      await outOfScopeController.handleGetScanPerDay(req, mockRes);

      expect(mockGetScanPerDay).toHaveBeenCalledWith(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([
        { date: "2025-03-20", count: 15 },
        { date: "2025-03-21", count: 22 },
      ]);
    });

    test("returns 500 when service throws", async () => {
      mockGetScanPerDay.mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = createResMock();

      await outOfScopeController.handleGetScanPerDay(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetOutOfScopeStatistics (view out-of-scope report)", () => {
    test("returns 200 with out-of-scope statistics", async () => {
      const mockRes = createResMock();
      const mockStats = [
        {
          skinAnalysisId: 1,
          email: "user@test.com",
          conditionName: "Melanoma",
          canRecommend: "no",
          status: "out_of_scope",
        },
      ];
      mockGetOutOfScopeStatistics.mockImplementation(async (req, res) => {
        res.status(200).json(mockStats);
      });

      const req = {};
      await outOfScopeController.handleGetOutOfScopeStatistics(req, mockRes);

      expect(mockGetOutOfScopeStatistics).toHaveBeenCalledWith(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockStats);
    });

    test("returns 500 when service throws", async () => {
      mockGetOutOfScopeStatistics.mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = createResMock();

      await outOfScopeController.handleGetOutOfScopeStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleDeleteOutOfScope", () => {
    test("returns 200 when deletion succeeds", async () => {
      const mockRes = createResMock();
      mockDeleteOutOfScope.mockImplementation(async (req, res) => {
        res.status(200).json({ message: "Condition deleted successfully" });
      });

      const req = { params: { id: "3" } };
      await outOfScopeController.handleDeleteOutOfScope(req, mockRes);

      expect(mockDeleteOutOfScope).toHaveBeenCalledWith(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Condition deleted successfully",
      });
    });

    test("returns 500 when service throws", async () => {
      mockDeleteOutOfScope.mockRejectedValue(new Error("DB error"));
      const req = { params: { id: "3" } };
      const res = createResMock();

      await outOfScopeController.handleDeleteOutOfScope(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
