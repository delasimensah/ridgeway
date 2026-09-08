import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import AddUnitForm from "./AddUnitForm";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockMutate = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockMutate,
}));

describe("AddUnitForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockMutate.mockReset();
  });

  it("renders the building, unit label, and kind", () => {
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
      />
    );

    expect(screen.getByLabelText(/building/i)).toHaveValue("Ridge Court");
    expect(screen.getByLabelText(/unit label/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /kind/i })).toHaveValue(
      "Apartment"
    );
    expect(
      screen.getByRole("button", { name: "Save unit" })
    ).toBeInTheDocument();
  });

  it("saves a unit and returns to the building", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue("unit-id");
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
      />
    );

    await user.type(screen.getByLabelText(/unit label/i), "A3");
    await user.click(screen.getByRole("button", { name: "Save unit" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        buildingId: "building-id",
        label: "A3",
        kind: "apartment",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings/building-id");
  });

  it("shows an error when save fails", async () => {
    const user = userEvent.setup();
    mockMutate.mockRejectedValue(new Error("NOT_PERMITTED"));
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
      />
    );

    await user.type(screen.getByLabelText(/unit label/i), "A3");
    await user.click(screen.getByRole("button", { name: "Save unit" }));

    expect(
      await screen.findByText(
        "Could not save this unit. Check the fields and try again."
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("goes back to the building when cancel is pressed", async () => {
    const user = userEvent.setup();
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/buildings/building-id");
  });

  it("saves corrections to an existing unit and returns to the building", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(null);
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        unitId={"unit-id" as never}
        initialValues={{
          label: "A3",
          kind: "apartment",
        }}
      />
    );

    await user.clear(screen.getByLabelText(/unit label/i));
    await user.type(screen.getByLabelText(/unit label/i), "B12");
    await user.click(screen.getByRole("button", { name: "Save unit" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        unitId: "unit-id",
        label: "B12",
        kind: "apartment",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings/building-id");
  });
});
