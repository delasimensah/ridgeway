import { render, screen } from "@testing-library/react-native";

import JobsScreen from "./JobsScreen";

describe("JobsScreen", () => {
  it("shows the empty copy when there are no jobs", () => {
    render(
      <JobsScreen
        headingDate="Sunday, 13 Sep"
        jobs={[]}
        refreshing={false}
        onRefresh={() => undefined}
        onOpenJob={() => undefined}
      />
    );
    expect(screen.getByText("No jobs assigned today.")).toBeTruthy();
  });

  it("shows job card skeletons while the list loads", () => {
    render(
      <JobsScreen
        headingDate="Sunday, 13 Sep"
        jobs={[]}
        isLoading
        refreshing={false}
        onRefresh={() => undefined}
        onOpenJob={() => undefined}
      />
    );
    expect(screen.getByLabelText("Loading jobs")).toBeTruthy();
    expect(screen.queryByText("Today's jobs")).toBeNull();
    expect(screen.queryByText("No jobs assigned today.")).toBeNull();
  });
});
