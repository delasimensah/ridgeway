import { render, screen } from "@testing-library/react-native";

import TenantHomeScreenSkeleton from "../../screens/tenant/TenantHomeScreen/TenantHomeScreenSkeleton";
import QueryPageStatus from "./QueryPageStatus";

describe("QueryPageStatus", () => {
  it("shows a tenant home skeleton while that page loads", () => {
    render(
      <QueryPageStatus
        loadState="loading"
        failedTitle="Couldn't load this page."
        skeleton={<TenantHomeScreenSkeleton />}
      >
        Home
      </QueryPageStatus>
    );

    expect(screen.getByLabelText("Loading home")).toBeTruthy();
    expect(screen.queryByLabelText("Loading page")).toBeNull();
    expect(screen.queryByText("Home")).toBeNull();
  });
});
