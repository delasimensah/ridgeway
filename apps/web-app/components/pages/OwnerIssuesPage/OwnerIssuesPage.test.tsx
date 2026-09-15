import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerIssuesPage from "./OwnerIssuesPage";

describe("OwnerIssuesPage", () => {
  it("lists open issues for this owner's buildings only", () => {
    render(
      <OwnerIssuesPage
        issues={[
          {
            _id: "wo-1",
            title: "B12 leak",
            status: "assigned",
            buildingName: "Ridge Court",
            address: "14 Ridge Road, Cantonments, Accra",
            tenantName: "Akosua Darko",
            unitKind: "apartment",
            reportedAt: Date.now(),
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Open issues" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "B12 leak" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ridge Court · Cantonments · Akosua Darko")
    ).toBeInTheDocument();
    expect(screen.queryByText("Labone walk-up")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /assign/i })
    ).not.toBeInTheDocument();
  });
});
