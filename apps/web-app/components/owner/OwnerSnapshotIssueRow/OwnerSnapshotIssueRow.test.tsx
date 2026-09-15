import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OwnerSnapshotIssueRow from "./OwnerSnapshotIssueRow";

describe("OwnerSnapshotIssueRow", () => {
  it("names the tenant on an open issue", () => {
    render(
      <OwnerSnapshotIssueRow
        title="B12 leak"
        tenantName="Akosua Darko"
        unitKind="apartment"
        status="assigned"
      />
    );

    expect(screen.getByText("B12 leak")).toBeInTheDocument();
    expect(screen.getByText("Tenant: Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("ASSIGNED")).toBeInTheDocument();
  });
});
