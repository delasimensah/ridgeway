import { notifications } from "@mantine/notifications";

import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "../notificationUtils";

// Mock @mantine/notifications
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

describe("Notification Utilities", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("showErrorNotification", () => {
    it("calls notifications.show with error configuration", () => {
      const message = "Test error message";
      showErrorNotification(message);

      expect(notifications.show).toHaveBeenCalledWith({
        title: "Error",
        message,
        color: "red",
        autoClose: false,
        withCloseButton: true,
        position: "top-right",
        className: "bg-red-600",
      });
    });

    it("calls notifications.show with custom title", () => {
      const message = "Custom error message";
      const title = "Custom Error";
      showErrorNotification(message, title);

      expect(notifications.show).toHaveBeenCalledWith({
        title,
        message,
        color: "red",
        autoClose: false,
        withCloseButton: true,
        position: "top-right",
        className: "bg-red-600",
      });
    });
  });

  describe("showSuccessNotification", () => {
    it("calls notifications.show with success configuration", () => {
      const message = "Test success message";
      showSuccessNotification(message);

      expect(notifications.show).toHaveBeenCalledWith({
        title: "Success",
        message,
        color: "green",
        autoClose: 3000,
        withCloseButton: true,
        position: "top-right",
        className: "bg-green-600",
      });
    });

    it("calls notifications.show with custom title", () => {
      const message = "Custom success message";
      const title = "Custom Success";
      showSuccessNotification(message, title);

      expect(notifications.show).toHaveBeenCalledWith({
        title,
        message,
        color: "green",
        autoClose: 3000,
        withCloseButton: true,
        position: "top-right",
        className: "bg-green-600",
      });
    });
  });

  describe("showInfoNotification", () => {
    it("calls notifications.show with info configuration", () => {
      const message = "Test info message";
      showInfoNotification(message);

      expect(notifications.show).toHaveBeenCalledWith({
        title: "Info",
        message,
        color: "blue",
        autoClose: 3000,
        withCloseButton: true,
        position: "top-right",
        className: "bg-blue-600",
      });
    });

    it("calls notifications.show with custom title", () => {
      const message = "Custom info message";
      const title = "Custom Info";
      showInfoNotification(message, title);

      expect(notifications.show).toHaveBeenCalledWith({
        title,
        message,
        color: "blue",
        autoClose: 3000,
        withCloseButton: true,
        position: "top-right",
        className: "bg-blue-600",
      });
    });
  });
});
