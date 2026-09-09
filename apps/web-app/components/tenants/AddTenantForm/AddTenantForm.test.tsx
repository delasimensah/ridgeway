import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import AddTenantForm from "./AddTenantForm";

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

const units = [{ _id: "unit-1", label: "G03" }];

describe("AddTenantForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockMutate.mockReset();
    mockAvailableTenants = [];
  });

  it("renders tenant fields", () => {
    render(<AddTenantForm buildingId={"building-id" as never} units={units} />);

    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lease start/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/started before Ridgeway the product existed/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save tenant" })
    ).toBeInTheDocument();
  });

  it("saves a tenant and lease on the named unit", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue("lease-id");
    render(
      <AddTenantForm
        buildingId={"building-id" as never}
        units={units}
        initialValues={{
          unitId: "unit-1",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "2027-12-31",
        }}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Akosua Darko"
    );
    await user.type(screen.getByLabelText(/email/i), "akosua@example.com");
    await user.click(screen.getByRole("button", { name: "Save tenant" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        unitId: "unit-1",
        displayName: "Akosua Darko",
        email: "akosua@example.com",
        phone: "",
        startedOn: "2024-01-15",
        endedOn: "2027-12-31",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings/building-id");
  });

  it("saves corrections to an existing tenant", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(null);
    render(
      <AddTenantForm
        buildingId={"building-id" as never}
        units={units}
        leaseId={"lease-id" as never}
        lockUnit
        initialValues={{
          unitId: "unit-1",
          displayName: "Akosua Darko",
          phone: "024 111 2222",
          email: "akosua@example.com",
          startedOn: "2024-01-15",
          endedOn: "2027-12-31",
        }}
      />
    );

    await user.clear(screen.getByRole("textbox", { name: /name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Akosua A. Darko"
    );
    await user.click(screen.getByRole("button", { name: "Save tenant" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        leaseId: "lease-id",
        displayName: "Akosua A. Darko",
        email: "akosua@example.com",
        phone: "024 111 2222",
        startedOn: "2024-01-15",
        endedOn: "2027-12-31",
      });
    });
  });

  it("shows an error when save fails", async () => {
    const user = userEvent.setup();
    mockMutate.mockRejectedValue(new Error("NOT_PERMITTED"));
    render(
      <AddTenantForm
        buildingId={"building-id" as never}
        units={units}
        initialValues={{
          unitId: "unit-1",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "",
        }}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Akosua Darko"
    );
    await user.type(screen.getByLabelText(/email/i), "akosua@example.com");
    await user.click(screen.getByRole("button", { name: "Save tenant" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not save this tenant. Check the fields and try again."
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows the lease start error on the date field", async () => {
    const user = userEvent.setup();
    mockMutate.mockRejectedValue({
      data: {
        code: "INVALID",
        message: "Lease start must be today or earlier",
      },
    });
    render(
      <AddTenantForm
        buildingId={"building-id" as never}
        units={units}
        initialValues={{
          unitId: "unit-1",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "",
        }}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Akosua Darko"
    );
    await user.type(screen.getByLabelText(/email/i), "akosua@example.com");
    await user.click(screen.getByRole("button", { name: "Save tenant" }));

    expect(
      await screen.findByText("Lease start must be today or earlier")
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("goes back to the building when cancel is pressed", async () => {
    const user = userEvent.setup();
    render(<AddTenantForm buildingId={"building-id" as never} units={units} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/buildings/building-id");
  });

  it("leases a vacant unit to someone who already rented", async () => {
    const user = userEvent.setup();
    mockAvailableTenants = [{ _id: "profile-1", displayName: "Sofia Herrera" }];
    mockMutate.mockResolvedValue("lease-id");
    render(
      <AddTenantForm
        buildingId={"building-id" as never}
        units={units}
        initialValues={{
          unitId: "unit-1",
          tenantChoice: "",
          displayName: "",
          phone: "",
          email: "",
          startedOn: "2024-01-15",
          endedOn: "",
        }}
      />
    );

    await user.click(screen.getByRole("combobox", { name: /tenant/i }));
    await user.click(
      await screen.findByRole("option", {
        name: "Sofia Herrera",
        hidden: true,
      })
    );
    await user.click(screen.getByRole("button", { name: "Save tenant" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        unitId: "unit-1",
        tenantProfileId: "profile-1",
        startedOn: "2024-01-15",
        endedOn: "",
      });
    });
  });
});
