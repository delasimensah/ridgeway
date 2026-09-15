import { render, screen } from "@testing-library/react-native";

import TenantRepairTimelineScreen from "./TenantRepairTimelineScreen";

describe("TenantRepairTimelineScreen", () => {
  it("shows received as the active step", () => {
    render(
      <TenantRepairTimelineScreen
        title="Kitchen tap leak"
        status="received"
        assigneeName={null}
        scheduledFor={null}
        reportedAt={Date.UTC(2026, 8, 2, 10, 30)}
        photoUrls={["https://example.com/leak.jpg"]}
        completionPhotoUrls={[]}
        events={[
          {
            _id: "ev-1",
            toStatus: "received",
            createdAt: Date.UTC(2026, 8, 2, 10, 30),
          },
        ]}
        onBack={() => undefined}
      />
    );

    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    expect(screen.getByText("Repair Status")).toBeTruthy();
    expect(screen.getByLabelText("Repair photo")).toBeTruthy();
    expect(screen.getByText("Waiting for a technician.")).toBeTruthy();
  });
});
