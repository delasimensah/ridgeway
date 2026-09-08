import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import AddOwnerForm from "./AddOwnerForm";

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

describe("AddOwnerForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockMutate.mockReset();
  });

  it("renders name, email, and phone", () => {
    render(<AddOwnerForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(
      screen.getByText("This person will see only buildings linked to them.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save owner" })
    ).toBeInTheDocument();
  });

  it("saves an owner and returns to the buildings list", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue("owner-id");
    render(<AddOwnerForm />);

    await user.type(screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await user.type(screen.getByLabelText(/email/i), "kwesi@example.com");
    await user.click(screen.getByRole("button", { name: "Save owner" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings");
  });

  it("attaches a new owner to a building when a building is named", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue("owner-id");
    render(<AddOwnerForm buildingId={"building-id" as never} />);

    await user.type(screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await user.click(screen.getByRole("button", { name: "Save owner" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        displayName: "Kwesi Mensah",
        contactEmail: "",
        contactPhone: "",
        buildingId: "building-id",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/buildings/building-id");
  });

  it("saves corrections to an existing owner", async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(null);
    render(
      <AddOwnerForm
        ownerId={"owner-id" as never}
        initialValues={{
          displayName: "Kwesi Mensah",
          contactEmail: "kwesi@example.com",
          contactPhone: "024 555 0000",
        }}
      />
    );

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Kwesi A. Mensah");
    await user.click(screen.getByRole("button", { name: "Save owner" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        ownerId: "owner-id",
        displayName: "Kwesi A. Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "024 555 0000",
      });
    });
  });

  it("shows an error when save fails", async () => {
    const user = userEvent.setup();
    mockMutate.mockRejectedValue(new Error("NOT_PERMITTED"));
    render(<AddOwnerForm />);

    await user.type(screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await user.click(screen.getByRole("button", { name: "Save owner" }));

    expect(
      await screen.findByText(
        "Could not save this owner. Check the fields and try again."
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("goes back to the list when cancel is pressed", async () => {
    const user = userEvent.setup();
    render(<AddOwnerForm />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/buildings");
  });
});
