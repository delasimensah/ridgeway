import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import AddUnitForm from "./AddUnitForm";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockMutate = jest.fn();
let mockAvailableTenants: { _id: string; displayName: string }[] = [];

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockMutate,
  useQuery: () => mockAvailableTenants,
}));

describe("AddUnitForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockMutate.mockReset();
    mockAvailableTenants = [];
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
    expect(
      screen.getByRole("combobox", { name: /tenant/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: /name/i })
    ).not.toBeInTheDocument();
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

  it("does not show the tenant select when correcting a unit", () => {
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

    expect(
      screen.queryByRole("combobox", { name: /tenant/i })
    ).not.toBeInTheDocument();
  });

  it("creates a unit with a tenant already living there", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue("unit-id");
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        initialValues={{
          label: "",
          kind: "apartment",
          tenantChoice: "",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "2027-12-31",
        }}
      />
    );

    await user.type(screen.getByLabelText(/unit label/i), "B12");
    await user.click(screen.getByRole("combobox", { name: /tenant/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a tenant/i,
        hidden: true,
      })
    );
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Akosua Darko"
    );
    await user.type(screen.getByLabelText(/email/i), "akosua@example.com");
    await user.click(screen.getByRole("button", { name: "Save unit" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        buildingId: "building-id",
        label: "B12",
        kind: "apartment",
        newTenant: {
          displayName: "Akosua Darko",
          email: "akosua@example.com",
          phone: "",
          startedOn: "2024-01-15",
          endedOn: "2027-12-31",
        },
      });
    });
  });

  it("creates a unit for someone who already rented", async () => {
    const user = userEvent.setup();
    mockAvailableTenants = [{ _id: "profile-1", displayName: "Sofia Herrera" }];
    mockMutate.mockResolvedValue("unit-id");
    render(
      <AddUnitForm
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        initialValues={{
          label: "",
          kind: "apartment",
          tenantChoice: "",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "",
        }}
      />
    );

    await user.type(screen.getByLabelText(/unit label/i), "4B");
    await user.click(screen.getByRole("combobox", { name: /tenant/i }));
    await user.click(
      await screen.findByRole("option", {
        name: "Sofia Herrera",
        hidden: true,
      })
    );
    await user.click(screen.getByRole("button", { name: "Save unit" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        buildingId: "building-id",
        label: "4B",
        kind: "apartment",
        existingTenant: {
          tenantProfileId: "profile-1",
          startedOn: "2024-01-15",
          endedOn: "",
        },
      });
    });
  });
});
