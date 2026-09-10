import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantHomePage from "./TenantHomePage";

describe("TenantHomePage", () => {
  it("shows the unit, file-repair action, and open repairs", () => {
    render(
      <TenantHomePage
        unitLabel="B12"
        buildingName="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        repairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            reportedAt: Date.UTC(2026, 8, 10),
          },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Unit B12 · Ridge Court" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "File a repair" })).toHaveAttribute(
      "href",
      "/repairs/new"
    );
    expect(screen.queryByText("GH₵ 4,500")).not.toBeInTheDocument();
    expect(screen.queryByText("Ask house rules")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /kitchen tap leak/i })
    ).toHaveAttribute("href", "/repairs/wo-1");
  });

  it("shows an empty repairs line when there are none", () => {
    render(
      <TenantHomePage
        unitLabel="B12"
        buildingName="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        repairs={[]}
      />
    );

    expect(screen.getByText("No open repairs.")).toBeInTheDocument();
  });
});
