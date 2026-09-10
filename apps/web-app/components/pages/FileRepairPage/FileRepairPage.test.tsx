import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import FileRepairPage from "./FileRepairPage";

jest.mock("../../repairs/FileRepairForm/FileRepairForm", () => ({
  __esModule: true,
  default: () => <div>File repair form</div>,
}));

describe("FileRepairPage", () => {
  it("shows the unit and file-repair heading", () => {
    render(
      <FileRepairPage
        unitId="unit-1"
        buildingName="Ridge Court"
        unitLabel="B12"
      />
    );

    expect(
      screen.getByRole("heading", { name: "File a repair" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ridge Court · B12")).toBeInTheDocument();
    expect(screen.getByText("File repair form")).toBeInTheDocument();
  });
});
