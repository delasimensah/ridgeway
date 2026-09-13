import { render, screen } from "@testing-library/react-native";

import JobDetailScreen from "./JobDetailScreen";

describe("JobDetailScreen", () => {
  it("shows update status for an assigned job", () => {
    render(
      <JobDetailScreen
        title="Kitchen tap leak"
        buildingName="Ridge Court"
        unitLabel="B12"
        address="14 Ridge Road, Cantonments, Accra"
        status="assigned"
        description="Confirm the leak with the tenant before starting."
        canUpdateStatus
        onBack={() => undefined}
        onUpdateStatus={() => undefined}
      />
    );
    expect(screen.getByText("Update status")).toBeTruthy();
    expect(screen.getByText("Ridge Court · B12")).toBeTruthy();
  });

  it("keeps the back control while the job loads", () => {
    render(
      <JobDetailScreen
        isLoading
        title=""
        buildingName=""
        unitLabel=""
        address=""
        status="assigned"
        description=""
        canUpdateStatus={false}
        onBack={() => undefined}
        onUpdateStatus={() => undefined}
      />
    );
    expect(screen.getByLabelText("Back")).toBeTruthy();
    expect(screen.getByLabelText("Loading job")).toBeTruthy();
    expect(screen.queryByText("Update status")).toBeNull();
  });
});
