import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

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
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(null);
    render(<TenantRepairTimelinePage {...ticket} canEditDescription />);

    expect(screen.getByText("RECEIVED")).toBeInTheDocument();
    expect(screen.getByText("Repair received")).toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: /description/i }));
    await user.type(
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
});
