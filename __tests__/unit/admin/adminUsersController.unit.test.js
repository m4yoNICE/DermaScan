import { jest } from "@jest/globals";

const mockGetAdminDataProcess = jest.fn();
const mockGetAllUsersProcess = jest.fn();
const mockGetUserByIdProcess = jest.fn();
const mockCreateUsersProcess = jest.fn();
const mockDeleteUserProcess = jest.fn();
const mockUpdateUserProcess = jest.fn();

jest.unstable_mockModule(
  "../../../AdminBE/services/adminUserServices.js",
  () => ({
    getAdminDataProcess: mockGetAdminDataProcess,
    getAllUsersProcess: mockGetAllUsersProcess,
    getUserByIdProcess: mockGetUserByIdProcess,
    createUsersProcess: mockCreateUsersProcess,
    deleteUserProcess: mockDeleteUserProcess,
    updateUserProcess: mockUpdateUserProcess,
  })
);

const adminUsersController = await import(
  "../../../AdminBE/controllers/adminUsersController.js"
);

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  setHeader: jest.fn(),
});

describe("adminUsersController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminData", () => {
    test("returns 200 with admin data when admin exists", async () => {
      const mockAdmin = { id: 1, email: "admin@test.com", role_id: 1 };
      mockGetAdminDataProcess.mockResolvedValue(mockAdmin);
      const req = { user: { id: 1 } };
      const res = createResMock();

      await adminUsersController.getAdminData(req, res);

      expect(mockGetAdminDataProcess).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        email: "admin@test.com",
        role: "admin",
      });
    });

    test("returns 404 when admin not found", async () => {
      mockGetAdminDataProcess.mockResolvedValue(null);
      const req = { user: { id: 999 } };
      const res = createResMock();

      await adminUsersController.getAdminData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Admin not found" });
    });

    test("returns 500 on unexpected error", async () => {
      mockGetAdminDataProcess.mockRejectedValue(new Error("DB error"));
      const req = { user: { id: 1 } };
      const res = createResMock();

      await adminUsersController.getAdminData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("getAllUsers", () => {
    test("returns 200 with users list", async () => {
      const mockUsers = [
        { id: 1, email: "u1@test.com", firstName: "John", lastName: "Doe" },
      ];
      mockGetAllUsersProcess.mockResolvedValue(mockUsers);
      const req = {};
      const res = createResMock();

      await adminUsersController.getAllUsers(req, res);

      expect(mockGetAllUsersProcess).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test("returns 500 on error", async () => {
      mockGetAllUsersProcess.mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = createResMock();

      await adminUsersController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Server error fetching users",
      });
    });
  });

  describe("getUserById", () => {
    test("returns 200 with user when found", async () => {
      const mockUser = { id: 2, email: "user@test.com", firstName: "Jane" };
      mockGetUserByIdProcess.mockResolvedValue(mockUser);
      const req = { params: { id: "2" } };
      const res = createResMock();

      await adminUsersController.getUserById(req, res);

      expect(mockGetUserByIdProcess).toHaveBeenCalledWith(2);
      expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    test("returns 404 when user not found", async () => {
      mockGetUserByIdProcess.mockResolvedValue(null);
      const req = { params: { id: "999" } };
      const res = createResMock();

      await adminUsersController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    test("returns 500 on error", async () => {
      mockGetUserByIdProcess.mockRejectedValue(new Error("DB error"));
      const req = { params: { id: "2" } };
      const res = createResMock();

      await adminUsersController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("createUsers", () => {
    test("returns 201 with new user when creation succeeds", async () => {
      const newUser = {
        id: 3,
        email: "new@test.com",
        firstName: "New",
        lastName: "User",
        roleId: 2,
      };
      mockCreateUsersProcess.mockResolvedValue(newUser);
      const req = {
        body: {
          email: "new@test.com",
          first_name: "New",
          last_name: "User",
          password: "secret123",
          role_id: 2,
          birthdate: "1990-01-15",
        },
      };
      const res = createResMock();

      await adminUsersController.createUsers(req, res);

      expect(mockCreateUsersProcess).toHaveBeenCalledWith(
        "new@test.com",
        "New",
        "User",
        "secret123",
        2,
        "1990-01-15"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user: newUser,
      });
    });

    test("returns 400 when fields are incomplete", async () => {
      mockCreateUsersProcess.mockRejectedValue(new Error("INCOMPLETE_FIELDS"));
      const req = {
        body: { email: "new@test.com", first_name: "New" },
      };
      const res = createResMock();

      await adminUsersController.createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields are required",
      });
    });

    test("returns 409 when email already exists", async () => {
      mockCreateUsersProcess.mockRejectedValue(new Error("EMAIL_FOUND"));
      const req = {
        body: {
          email: "existing@test.com",
          first_name: "Test",
          last_name: "User",
          password: "pass",
          role_id: 2,
        },
      };
      const res = createResMock();

      await adminUsersController.createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
    });

    test("returns 500 on unexpected error", async () => {
      mockCreateUsersProcess.mockRejectedValue(new Error("DB error"));
      const req = {
        body: {
          email: "x@test.com",
          first_name: "X",
          last_name: "Y",
          password: "pass",
          role_id: 2,
        },
      };
      const res = createResMock();

      await adminUsersController.createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("updateUser", () => {
    test("returns 200 with updated user when update succeeds", async () => {
      const updatedUser = {
        id: 2,
        email: "updated@test.com",
        firstName: "Updated",
        lastName: "Name",
        roleId: 2,
      };
      mockUpdateUserProcess.mockResolvedValue(updatedUser);
      const req = {
        params: { id: "2" },
        body: {
          first_name: "Updated",
          last_name: "Name",
          email: "updated@test.com",
          password: "",
          role_id: 2,
          birthdate: "1995-05-20",
        },
      };
      const res = createResMock();

      await adminUsersController.updateUser(req, res);

      expect(mockUpdateUserProcess).toHaveBeenCalledWith(
        "2",
        "Updated",
        "Name",
        "updated@test.com",
        "",
        2,
        "1995-05-20"
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: updatedUser,
      });
    });

    test("returns 404 when user not found", async () => {
      mockUpdateUserProcess.mockRejectedValue(new Error("USER_NOT_FOUND"));
      const req = {
        params: { id: "999" },
        body: {
          first_name: "X",
          last_name: "Y",
          email: "x@test.com",
          role_id: 2,
        },
      };
      const res = createResMock();

      await adminUsersController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    test("returns 500 on unexpected error", async () => {
      mockUpdateUserProcess.mockRejectedValue(new Error("DB error"));
      const req = {
        params: { id: "2" },
        body: {
          first_name: "X",
          last_name: "Y",
          email: "x@test.com",
          role_id: 2,
        },
      };
      const res = createResMock();

      await adminUsersController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Server error while updating user",
      });
    });
  });

  describe("deleteUser", () => {
    test("returns 200 with success message when delete succeeds", async () => {
      mockDeleteUserProcess.mockResolvedValue(undefined);
      const req = { params: { id: "5" } };
      const res = createResMock();

      await adminUsersController.deleteUser(req, res);

      expect(mockDeleteUserProcess).toHaveBeenCalledWith("5");
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    test("returns 404 when account not found", async () => {
      mockDeleteUserProcess.mockRejectedValue(new Error("ACCOUNT_NOT_FOUND"));
      const req = { params: { id: "999" } };
      const res = createResMock();

      await adminUsersController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Account did not exist",
      });
    });

    test("returns 500 on unexpected error", async () => {
      mockDeleteUserProcess.mockRejectedValue(new Error("DB error"));
      const req = { params: { id: "5" } };
      const res = createResMock();

      await adminUsersController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
