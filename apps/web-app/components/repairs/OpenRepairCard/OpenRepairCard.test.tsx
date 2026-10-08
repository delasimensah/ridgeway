import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import OpenRepairCard from "./OpenRepairCard";

describe("OpenRepairCard", () => {
  it("links to the repair with title and status", () => {
    render(
      <OpenRepairCard
        href="/repairs/wo-1"
        title="Kitchen tap leak"
        subtitle="Reported 10 Sep 2026"
        status="received"
      />
    );

    expect(
      screen.getByRole("link", { name: /kitchen tap leak/i })
    ).toHaveAttribute("href", "/repairs/wo-1");
    expect(screen.getByText("Received")).toBeInTheDocument();
  });
});
