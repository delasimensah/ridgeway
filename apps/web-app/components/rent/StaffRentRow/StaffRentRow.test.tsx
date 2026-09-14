import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

import { render, setupUser } from "@/test-utils";

import StaffRentRow from "./StaffRentRow";

const BASE_PROPS = {
  unitLabel: "B12",
  tenantName: "Akosua Darko",
  amount: 450000,
  currency: "GHS" as const,
  dueOn: "2026-09-05",
  confirmedAmount: null,
  arrears: 0,
  serverNow: Date.UTC(2026, 8, 13),
};

function renderRow(props: Partial<React.ComponentProps<typeof StaffRentRow>>) {
  return render(
    <Table>
      <Table.Tbody>
        <StaffRentRow
          {...BASE_PROPS}
          confirmedStatus="unpaid"
          tenantReportedAt={null}
          onSetStatus={jest.fn()}
          onRequestPartial={jest.fn()}
          {...props}
        />
      </Table.Tbody>
    </Table>
  );
}

describe("StaffRentRow", () => {
  it("shows the monthly rent with its due date and lets staff confirm paid", async () => {
    const user = setupUser();
    const onSetStatus = jest.fn();
    renderRow({ onSetStatus });

    expect(screen.getByText("B12")).toBeInTheDocument();
    expect(screen.getByText("Akosua Darko")).toBeInTheDocument();
    expect(screen.getByText("GH₵ 4,500")).toBeInTheDocument();
    expect(screen.getByText("Due 5 Sep 2026")).toBeInTheDocument();
    expect(
      screen.getByText("Late", { selector: "span.rounded-full" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("combobox", { name: "Confirm rent for B12" })
    );
    await user.click(
      await screen.findByRole("option", { name: /^Paid$/i, hidden: true })
    );
    expect(onSetStatus).toHaveBeenCalledWith("paid");
  });

  it("tells staff when the tenant has reported a payment", () => {
    renderRow({ tenantReportedAt: Date.UTC(2026, 8, 12) });

    expect(
      screen.getByText("Tenant reported payment on 12 Sep 2026 · confirm it")
    ).toBeInTheDocument();
  });

  it("shows what a partial payment left owing", () => {
    renderRow({ confirmedStatus: "partial", confirmedAmount: 200000 });

    expect(
      screen.getByText("GH₵ 2,000 received · GH₵ 2,500 still owed")
    ).toBeInTheDocument();
  });

  it("shows arrears carried from earlier months", () => {
    renderRow({ arrears: 300000 });

    expect(
      screen.getByText("GH₵ 3,000 in arrears from earlier months")
    ).toBeInTheDocument();
  });
});
