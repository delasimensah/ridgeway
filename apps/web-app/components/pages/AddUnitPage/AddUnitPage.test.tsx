import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddUnitPage from "./AddUnitPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
}));

describe("AddUnitPage", () => {
  it("shows the add unit form", () => {
    render(
      <AddUnitPage
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Add unit" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/unit label/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save unit" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved unit is opened", () => {
    render(
      <AddUnitPage
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        unitId={"unit-id" as never}
        initialValues={{
          label: "A3",
          kind: "apartment",
        }}
      />
    );

    expect(screen.getByLabelText(/unit label/i)).toHaveValue("A3");
    expect(screen.getByLabelText(/building/i)).toHaveValue("Ridge Court");
  });
});
