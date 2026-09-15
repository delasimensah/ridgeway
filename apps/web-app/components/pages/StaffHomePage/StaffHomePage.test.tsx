import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffHomePage from "./StaffHomePage";

const REPAIR = {
  _id: "wo-1",
  title: "B12 leak",
  status: "assigned" as const,
  unitLabel: "B12",
  buildingName: "Ridge Court",
};

describe("StaffHomePage", () => {
  it("shows buildings, open repairs, and rent status with links to shipped screens", () => {
    render(
      <StaffHomePage
        greeting="Good afternoon, Ama"
        buildingCount={2}
        emptyUnitCount={1}
        repairs={[REPAIR]}
        collected={8640000}
        outstanding={1215000}
        currency="GHS"
        serverNow={Date.UTC(2026, 8, 13)}
        rentPeriods={[
          { confirmedStatus: "unpaid", dueOn: "2026-09-05" },
          { confirmedStatus: "paid", dueOn: "2026-09-05" },
          { confirmedStatus: "partial", dueOn: "2026-09-05" },
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Good afternoon, Ama" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buildings 2" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(
      screen.getByRole("link", { name: "Open repairs 1" })
    ).toHaveAttribute("href", "/repairs");
    expect(screen.getByRole("link", { name: "Rent late 1" })).toHaveAttribute(
      "href",
      "/rent"
    );
    expect(screen.getByRole("link", { name: "Units empty 1" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(
      screen.getByRole("heading", { name: "Today at Ridge Court" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /b12 leak/i })).toHaveAttribute(
      "href",
      "/repairs/wo-1"
    );
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rent status" })).toHaveAttribute(
      "href",
      "/rent"
    );
    expect(screen.getByText("GH₵ 86,400")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 12,150")).toBeInTheDocument();
  });

  it("keeps a next action when the portfolio is empty", () => {
    render(
      <StaffHomePage
        greeting="Good afternoon, Ama"
        buildingCount={0}
        emptyUnitCount={0}
        repairs={[]}
        collected={0}
        outstanding={0}
        currency="GHS"
        serverNow={0}
        rentPeriods={[]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "No buildings yet." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add building" })).toHaveAttribute(
      "href",
      "/buildings/new"
    );
    expect(screen.queryByText("Open repairs")).not.toBeInTheDocument();
  });

  it("keeps rent and repair headings and shows skeletons while home loads", () => {
    render(
      <StaffHomePage
        greeting="Good afternoon, Ama"
        loadState="loading"
        buildingCount={0}
        emptyUnitCount={0}
        repairs={[]}
        collected={0}
        outstanding={0}
        currency="GHS"
        serverNow={0}
        rentPeriods={[]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Open repairs" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Rent status" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Loading repairs")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading rent summary")).toBeInTheDocument();
    expect(screen.queryByText("No open repairs.")).not.toBeInTheDocument();
    expect(screen.queryByText("GH₵ 0")).not.toBeInTheDocument();
  });
});
