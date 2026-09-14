import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import TenantHomePage from "./TenantHomePage";

describe("TenantHomePage", () => {
  it("shows the unit, rent reminder, file-repair action, and open repairs", () => {
    render(
      <TenantHomePage
        unitLabel="B12"
        buildingName="Ridge Court"
        address="14 Ridge Road, Cantonments, Accra"
        serverNow={Date.UTC(2026, 8, 13)}
        nextRent={{
          amount: 450000,
          currency: "GHS",
          dueOn: "2026-09-05",
          confirmedStatus: "unpaid",
        }}
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
    expect(screen.getByRole("link", { name: "Rent" })).toHaveAttribute(
      "href",
      "/rent"
    );
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
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
