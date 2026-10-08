import { IconBuilding } from "@tabler/icons-react";
import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import StaffHomeMetricCard from "./StaffHomeMetricCard";

describe("StaffHomeMetricCard", () => {
  it("links the count to the matching list", () => {
    render(
      <StaffHomeMetricCard
        label="Buildings"
        value={10}
        href="/buildings"
        Icon={IconBuilding}
      />
    );

    expect(screen.getByRole("link", { name: "Buildings 10" })).toHaveAttribute(
      "href",
      "/buildings"
    );
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
