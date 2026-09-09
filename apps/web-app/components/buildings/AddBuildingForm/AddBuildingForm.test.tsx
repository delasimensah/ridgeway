import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import AddBuildingForm from "./AddBuildingForm";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockCreate = jest.fn();
let mockOwners: { _id: string; displayName: string }[] = [];

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockCreate,
  useQuery: () => mockOwners,
}));

describe("AddBuildingForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockCreate.mockReset();
    mockOwners = [];
  });

  it("renders name, street, area, and Accra as the city", () => {
    render(<AddBuildingForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toHaveValue("Accra");
    expect(
      screen.getByRole("combobox", { name: /owner/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save building" })
    ).toBeInTheDocument();
  });

  it("saves a building and returns to the list", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await user.type(screen.getByLabelText(/name/i), "Ridge Court");
    await user.type(screen.getByLabelText(/street/i), "14 Ridge Road");
    await user.type(screen.getByLabelText(/area/i), "Cantonments");
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings");
  });

  it("shows an error when save fails", async () => {
    const user = userEvent.setup();
    mockCreate.mockRejectedValue(new Error("NOT_PERMITTED"));
    render(<AddBuildingForm />);

    await user.type(screen.getByLabelText(/name/i), "Ridge Court");
    await user.type(screen.getByLabelText(/street/i), "14 Ridge Road");
    await user.type(screen.getByLabelText(/area/i), "Cantonments");
    await user.click(screen.getByRole("button", { name: "Save building" }));

    expect(
      await screen.findByText(
        "Could not save this building. Check the fields and try again."
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("goes back to the list when cancel is pressed", async () => {
    const user = userEvent.setup();
    render(<AddBuildingForm />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/buildings");
  });

  it("saves corrections to an existing building and returns to the list", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue(null);
    render(
      <AddBuildingForm
        buildingId={"building-id" as never}
        initialValues={{
          name: "Ridge Court",
          street: "14 Ridge Road",
          area: "Cantonments",
        }}
      />
    );

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), "Ridge Court East");
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        buildingId: "building-id",
        name: "Ridge Court East",
        street: "14 Ridge Road",
        area: "Cantonments",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings");
  });

  it("does not show the owner select when correcting a building", () => {
    render(
      <AddBuildingForm
        buildingId={"building-id" as never}
        initialValues={{
          name: "Ridge Court",
          street: "14 Ridge Road",
          area: "Cantonments",
        }}
      />
    );

    expect(
      screen.queryByRole("combobox", { name: /owner/i })
    ).not.toBeInTheDocument();
  });

  it("creates a building with a new owner from the same form", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await user.type(screen.getByLabelText(/name/i), "Ridge Court");
    await user.type(screen.getByLabelText(/street/i), "14 Ridge Road");
    await user.type(screen.getByLabelText(/area/i), "Cantonments");
    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a new owner/i,
        hidden: true,
      })
    );
    await user.type(screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await user.type(screen.getByLabelText(/email/i), "kwesi@example.com");
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
        newOwner: {
          displayName: "Kwesi Mensah",
          contactEmail: "kwesi@example.com",
          contactPhone: "",
        },
      });
    });
  });

  it("links a building to an owner already on file", async () => {
    const user = userEvent.setup();
    mockOwners = [{ _id: "owner-1", displayName: "Kwesi Mensah" }];
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await user.type(screen.getByLabelText(/name/i), "Ridge Court");
    await user.type(screen.getByLabelText(/street/i), "14 Ridge Road");
    await user.type(screen.getByLabelText(/area/i), "Cantonments");
    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", { name: "Kwesi Mensah", hidden: true })
    );
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Ridge Court",
        street: "14 Ridge Road",
        area: "Cantonments",
        ownerId: "owner-1",
      });
    });
  });
});
