/**
 * Shared mock details for integration tests.
 * Centralizes request/response mocks and test data across integration suites.
 */

import { jest } from "@jest/globals";

// --- Mock User Data ---
export const mockUser = {
  id: 1,
  email: "test@integration.example.com",
  firstname: "Integration",
  lastname: "Test",
  birthdate: "1990-01-15",
};

// --- Mock Auth Payloads ---
export const mockAuthRegister = {
  email: "mock-register@integration.example.com",
  firstname: "John",
  lastname: "Doe",
  dob: "1990-01-15",
  password: "securepass123",
};

export const mockAuthLogin = {
  email: "mock-login@integration.example.com",
  password: "validpass123",
};

export const mockAuthInvalid = {
  email: "nonexistent-user@integration-test.example.com",
  password: "wrongpassword",
};

export const mockAuthEmpty = {};
export const mockAdminAuthInvalid = {
  email: "admin-invalid@integration-test.example.com",
  password: "wrongpassword",
};
export const mockInvalidToken = "invalid.token.value";

export const mockAdminCreateUserPayload = {
  email: "new-admin-user@example.com",
  first_name: "Admin",
  last_name: "Created",
  password: "securePass123",
  role_id: 2,
  birthdate: "1994-02-10",
};

export const mockAdminUpdateUserPayload = {
  first_name: "Updated",
  last_name: "Name",
  email: "updated-admin-user@example.com",
  password: "updatedPass456",
  role_id: 2,
  birthdate: "1993-09-15",
};

// --- Mock Skin Data ---
export const mockSkinData = {
  skin_type: "Oily",
  skin_sensitivity: 2,
  pigmentation: "Mild",
  aging: "Early signs",
};

export const mockSkinDataEmpty = {};
export const mockUserProfileUpdate = {
  firstname: "Updated",
  lastname: "User",
  birthdate: "1992-10-01",
  currentPassword: "oldPass123",
  newPassword: "newPass456",
};

// --- Mock Journal Data ---
export const mockJournalCreate = {
  journalDate: "2024-01-15",
  journalText: "Test journal entry content",
};

export const mockJournalUpdate = {
  journalText: "Updated journal entry content",
};

export const mockJournalEmpty = {};

// --- Mock Routine Data ---
export const mockRoutineSchedule = {
  morningTime: "08:00",
  eveningTime: "21:00",
};

export const mockRoutineCompleteSchedule = {
  schedule: "morning",
};

export const mockRoutineEmpty = {};

// --- Mock Recommendation Data ---
export const mockRecommendationSave = {
  analysisId: 1,
  productIds: [1, 2, 3],
};

export const mockRecommendationEmpty = {};

// --- Mock Image Params ---
export const mockImageParams = { id: "1" };
export const mockImageParamsEmpty = {};
export const mockImageId = 1;

// --- Mock File (for skin analysis) ---
export const mockFile = {
  buffer: Buffer.from("fake-image-data"),
  originalname: "test-skin.jpg",
  mimetype: "image/jpeg",
};

export const mockFileNull = null;

// --- Mock Request/Response Factories ---

/**
 * Creates a mock Express request object.
 * @param {Object} overrides - Override default values (body, user, params, file)
 */
export function createMockReq(overrides = {}) {
  return {
    body: {},
    user: { id: mockUser.id },
    params: {},
    file: null,
    ...overrides,
  };
}

/**
 * Creates a mock Express response object with Jest mocks.
 */
export function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

// --- Unique Email Generator (for auth tests that require unique emails) ---
export function uniqueEmail(prefix = "integration") {
  return `${prefix}-${Date.now()}@example.com`;
}

// --- HTTP Test Helpers ---
export const mockEndpoints = {
  user: [
    { method: "get", path: "/api/users", body: undefined },
    { method: "post", path: "/api/users/skin", body: mockSkinDataEmpty },
    { method: "delete", path: "/api/users/skinreset", body: undefined },
    { method: "put", path: "/api/users", body: mockJournalEmpty },
    { method: "delete", path: "/api/users", body: undefined },
  ],
  journal: [
    { method: "get", path: "/api/journals", body: undefined },
    { method: "post", path: "/api/journals", body: mockJournalEmpty },
    { method: "put", path: "/api/journals/1", body: mockJournalUpdate },
    { method: "delete", path: "/api/journals/1", body: undefined },
    { method: "get", path: "/api/journals/date/2023-01-01", body: undefined },
  ],
  routine: { method: "get", path: "/api/routines/schedule" },
  recommend: [
    { method: "get", path: "/api/recommendations", body: undefined },
    { method: "post", path: "/api/recommendations", body: mockRecommendationEmpty },
  ],
  image: { method: "get", path: "/api/images/1" },
  conditions: { method: "post", path: "/api/conditions/skin" },
};
