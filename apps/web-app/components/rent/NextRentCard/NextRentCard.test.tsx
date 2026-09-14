import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import NextRentCard from "./NextRentCard";

describe("NextRentCard", () => {
  it("shows the amount, due date, and late status", () => {
    render(
      <NextRentCard
        amount={450000}
        currency="GHS"
        dueOn="2026-09-05"
        confirmedStatus="unpaid"
        serverNow={Date.UTC(2026, 8, 13)}
      />
    );

    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("Due 5 Sep 2026")).toBeInTheDocument();
    expect(screen.getByText("Late")).toBeInTheDocument();
  });
});
