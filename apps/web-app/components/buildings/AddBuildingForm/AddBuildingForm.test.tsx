import { screen, waitFor } from "@testing-library/react";

import { fillField, render, setupUser } from "@/test-utils";

import AddBuildingForm from "./AddBuildingForm";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockCreate = jest.fn();
const mockGrantLogin = jest.fn();
let mockOwners: {
  _id: string;
  displayName: string;
  contactEmail?: string;
  hasLogin?: boolean;
}[] = [];

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockCreate,
  useAction: () => mockGrantLogin,
  useQuery: () => mockOwners,
}));

async function fillAddress(user: ReturnType<typeof setupUser>): Promise<void> {
  await fillField(
    user,
    screen.getByRole("textbox", { name: /^name/i }),
    "Ridge Court"
  );
  await fillField(
    user,
    screen.getByRole("textbox", { name: /^street/i }),
    "14 Ridge Road"
  );
  await fillField(
    user,
    screen.getByRole("textbox", { name: /^area/i }),
    "Cantonments"
  );
}

describe("AddBuildingForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockCreate.mockReset();
    mockGrantLogin.mockReset();
    mockOwners = [];
  });

  it("renders name, street, area, and Accra as the city", () => {
    render(<AddBuildingForm />);

    expect(screen.getByRole("textbox", { name: /^name/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^street/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^area/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^city/i })).toHaveValue(
      "Accra"
    );
    expect(
      screen.getByRole("combobox", { name: /owner/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save building" })
    ).toBeInTheDocument();
  });

  it("saves a building and returns to the list", async () => {
    const user = setupUser();
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await fillAddress(user);
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
    const user = setupUser();
    mockCreate.mockRejectedValue(new Error("NOT_PERMITTED"));
    render(<AddBuildingForm />);

    await fillAddress(user);
    await user.click(screen.getByRole("button", { name: "Save building" }));

    expect(
      await screen.findByText(
        "Could not save this building. Check the fields and try again."
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("goes back to the list when cancel is pressed", async () => {
    const user = setupUser();
    render(<AddBuildingForm />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockPush).toHaveBeenCalledWith("/buildings");
  });

  it("saves corrections to an existing building and returns to the list", async () => {
    const user = setupUser();
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

    await fillField(
      user,
      screen.getByRole("textbox", { name: /^name/i }),
      "Ridge Court East"
    );
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
    const user = setupUser();
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await fillAddress(user);
    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a new owner/i,
        hidden: true,
      })
    );
    await fillField(user, screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await fillField(user, screen.getByLabelText(/email/i), "kwesi@example.com");
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

  it("grants a login when a new owner is given a password", async () => {
    const user = setupUser();
    mockGrantLogin.mockResolvedValue("owner-id");
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await fillAddress(user);
    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a new owner/i,
        hidden: true,
      })
    );
    await fillField(user, screen.getByLabelText(/full name/i), "Kwesi Mensah");
    await fillField(user, screen.getByLabelText(/email/i), "kwesi@example.com");
    await fillField(
      user,
      screen.getByLabelText(/^password$/i),
      "RidgewayOwnerA26"
    );
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockGrantLogin).toHaveBeenCalledWith({
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "",
        password: "RidgewayOwnerA26",
      });
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
      ownerId: "owner-id",
    });
  });

  it("links a building to an owner already on file", async () => {
    const user = setupUser();
    mockOwners = [
      { _id: "owner-1", displayName: "Kwesi Mensah", hasLogin: true },
    ];
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await fillAddress(user);
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

  it("grants a login when the chosen owner has none", async () => {
    const user = setupUser();
    mockOwners = [
      {
        _id: "owner-1",
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        hasLogin: false,
      },
    ];
    mockGrantLogin.mockResolvedValue("owner-1");
    mockCreate.mockResolvedValue("building-id");
    render(<AddBuildingForm />);

    await fillAddress(user);
    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", {
        name: "Kwesi Mensah",
        hidden: true,
      })
    );
    await fillField(
      user,
      screen.getByLabelText(/^password$/i),
      "RidgewayOwnerA26"
    );
    await user.click(screen.getByRole("button", { name: "Save building" }));

    await waitFor(() => {
      expect(mockGrantLogin).toHaveBeenCalledWith({
        ownerId: "owner-1",
        displayName: "Kwesi Mensah",
        contactEmail: "kwesi@example.com",
        contactPhone: "",
        password: "RidgewayOwnerA26",
      });
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Ridge Court",
      street: "14 Ridge Road",
      area: "Cantonments",
      ownerId: "owner-1",
    });
  });
});
