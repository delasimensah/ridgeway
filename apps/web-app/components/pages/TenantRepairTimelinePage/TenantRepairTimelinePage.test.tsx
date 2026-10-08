import { screen } from "@testing-library/react";

import { fillField, render, setupUser } from "@/test-utils";

import TenantRepairTimelinePage from "./TenantRepairTimelinePage";

const mockMutate = jest.fn();

jest.mock("convex/react", () => ({
  useMutation: () => mockMutate,
}));

const ticket = {
  workOrderId: "wo-1" as never,
  title: "Kitchen tap leak",
  description: "The tap drips.",
  status: "received" as const,
  category: "plumbing",
  unitLabel: "B12",
  buildingName: "Ridge Court",
  reportedAt: Date.UTC(2026, 7, 22),
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

describe("TenantRepairTimelinePage", () => {
  beforeEach(() => {
    mockMutate.mockReset();
  });

  it("shows received status and lets the tenant correct the description", async () => {
    const user = setupUser();
    mockMutate.mockResolvedValue(null);
    render(<TenantRepairTimelinePage {...ticket} canEditDescription />);

    expect(screen.getByText("Received")).toBeInTheDocument();
    expect(screen.getByText("Repair received")).toBeInTheDocument();
    await fillField(
      user,
      screen.getByRole("textbox", { name: /description/i }),
      "Bathroom tap leak"
    );
    await user.click(screen.getByRole("button", { name: "Save description" }));
    expect(mockMutate).toHaveBeenCalledWith({
      workOrderId: "wo-1",
      description: "Bathroom tap leak",
    });
  });

  it("hides the editor when the ticket is past received", () => {
    render(
      <TenantRepairTimelinePage
        {...ticket}
        status="assigned"
        canEditDescription={false}
      />
    );

    expect(screen.getByText("The tap drips.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save description" })
    ).not.toBeInTheDocument();
  });

  it("keeps the timeline chrome while the repair loads", () => {
    render(
      <TenantRepairTimelinePage
        {...ticket}
        loadState="loading"
        canEditDescription
      />
    );

    expect(screen.getByText("Back to home")).toBeInTheDocument();
    expect(screen.getByText("Building")).toBeInTheDocument();
    expect(screen.getByText("Activity timeline")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading repair")).toBeInTheDocument();
    expect(screen.queryByText("Kitchen tap leak")).not.toBeInTheDocument();
  });
});
