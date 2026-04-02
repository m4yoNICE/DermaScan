import { jest } from "@jest/globals";

const mockSendMail = jest.fn();

jest.unstable_mockModule("../../../config/env.js", () => ({
  ENV: { OTP_USER: "test@test.com", OTP_PASSWORD_OTP: "testpass" },
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: mockSendMail,
    }),
  },
}));

const { sendEmail } = await import("../../../utils/sendOTP.js");

describe("sendOTP utility - sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("module exports sendEmail", () => {
    expect(sendEmail).toBeDefined();
    expect(typeof sendEmail).toBe("function");
  });

  test("valid email and OTP sends successfully and returns true", async () => {
    mockSendMail.mockResolvedValue({ messageId: "test-id" });

    const result = await sendEmail("user@example.com", "123456");

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: expect.stringContaining("123456"),
        html: expect.stringContaining("123456"),
      })
    );
    expect(result).toBe(true);
  });

  test("sendEmail includes OTP in subject and body", async () => {
    mockSendMail.mockResolvedValue({});

    await sendEmail("test@test.com", "654321");

    const call = mockSendMail.mock.calls[0][0];
    expect(call.subject).toBe("Your OTP is 654321");
    expect(call.html).toContain("654321");
    expect(call.html).toContain("5 minutes");
  });

  test("sendEmail returns false when nodemailer fails", async () => {
    mockSendMail.mockRejectedValue(new Error("SMTP connection failed"));

    const result = await sendEmail("user@example.com", "123456");

    expect(result).toBe(false);
  });
});
