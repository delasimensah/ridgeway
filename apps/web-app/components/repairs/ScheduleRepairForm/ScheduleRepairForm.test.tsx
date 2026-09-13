import { screen, waitFor } from "@testing-library/react";

import { render, setupUser } from "@/test-utils";

import ScheduleRepairForm from "./ScheduleRepairForm";

const mockSchedule = jest.fn();

jest.mock("convex/react", () => ({
  useMutation: () => mockSchedule,
}));

describe("ScheduleRepairForm", () => {
  beforeEach(() => {
    mockSchedule.mockReset();
  });

  it("schedules the repair for the chosen date", async () => {
    const user = setupUser();
    mockSchedule.mockResolvedValue(null);
    render(
      <ScheduleRepairForm
        workOrderId={"wo-1" as never}
        initialValues={{ scheduledFor: "2026-09-13" }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Schedule" }));

    await waitFor(() => {
      expect(mockSchedule).toHaveBeenCalledWith({
        workOrderId: "wo-1",
        scheduledFor: "2026-09-13",
      });
    });
  });
});
