import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerPortfolioIssueRow from "./OwnerPortfolioIssueRow";

describe("OwnerPortfolioIssueRow", () => {
  it("shows the building, area, and tenant on an open issue", () => {
    render(
      <OwnerPortfolioIssueRow
        title="B12 leak"
        status="assigned"
        buildingName="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        tenantName="Akosua Darko"
        unitKind="apartment"
        reportedAt={Date.now()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "B12 leak" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ridge Court · Cantonments · Akosua Darko")
    ).toBeInTheDocument();
    expect(screen.getByText("ASSIGNED")).toBeInTheDocument();
    expect(screen.getByText("Reported")).toBeInTheDocument();
  });
});
