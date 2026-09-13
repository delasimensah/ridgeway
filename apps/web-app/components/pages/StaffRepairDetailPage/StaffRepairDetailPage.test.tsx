import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffRepairDetailPage from "./StaffRepairDetailPage";

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
}));

const ticket = {
  workOrderId: "wo-1",
  title: "Kitchen tap leak",
  description: "The tap drips.",
  status: "received" as const,
  category: "plumbing",
  unitLabel: "B12",
  buildingName: "Ridge Court",
  buildingId: "building-1",
  tenantName: "Akosua Darko",
  assigneeName: null,
  scheduledFor: null,
  reportedAt: Date.UTC(2026, 7, 22),
  canAssign: true,
  canSchedule: false,
  fieldWorkers: [{ _id: "field-1", displayName: "Yaw Darko" }],
  photoUrls: [] as string[],
  completionPhotoUrls: [] as string[],
  events: [
    {
      _id: "ev-1",
      toStatus: "received" as const,
      actorName: "Akosua Darko",
      createdAt: Date.UTC(2026, 7, 22),
    },
  ],
};

describe("StaffRepairDetailPage", () => {
  it("shows assign when the ticket is received", () => {
    render(<StaffRepairDetailPage {...ticket} />);

    expect(
      screen.getByRole("heading", { name: "Repair: Kitchen tap leak" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Schedule" })
    ).not.toBeInTheDocument();
  });
});
