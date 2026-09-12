import { screen, waitFor } from "@testing-library/react";

import { fillField, render, setupUser } from "@/test-utils";

import AddOfficePersonForm from "./AddOfficePersonForm";

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockSetPassword = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factory
  const { getFunctionName } = require("convex/server") as {
    getFunctionName: (ref: unknown) => string;
  };
  return {
    useMutation: () => mockUpdate,
    useAction: (ref: unknown) =>
      getFunctionName(ref) === "staff:setPassword"
        ? mockSetPassword
        : mockCreate,
  };
});

describe("AddOfficePersonForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockSetPassword.mockReset();
  });

  it("saves a new office person", async () => {
    const user = setupUser();
    mockCreate.mockResolvedValue("profile-id");
    render(
      <AddOfficePersonForm
        initialValues={{
          displayName: "Efua Mensah",
          email: "efua.mensah@ridgeway.gh",
          password: "RidgewayOffice26",
        }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Save office person" })
    );

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        displayName: "Efua Mensah",
        email: "efua.mensah@ridgeway.gh",
        password: "RidgewayOffice26",
      });
    });
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockSetPassword).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/office");
  });

  it("sets a new password when one is typed on an existing person", async () => {
    const user = setupUser();
    mockUpdate.mockResolvedValue(null);
    mockSetPassword.mockResolvedValue(null);
    render(
      <AddOfficePersonForm
        profileId={"profile-id" as never}
        initialValues={{
          displayName: "Efua Mensah",
          email: "efua.mensah@ridgeway.gh",
          password: "",
        }}
      />
    );

    expect(
      screen.getByText("Optional. Leave blank to keep the current password.")
    ).toBeInTheDocument();

    await fillField(
      user,
      screen.getByLabelText(/^password$/i),
      "RidgewayOffice27"
    );
    await user.click(
      screen.getByRole("button", { name: "Save office person" })
    );

    await waitFor(() => {
      expect(mockSetPassword).toHaveBeenCalledWith({
        profileId: "profile-id",
        password: "RidgewayOffice27",
      });
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      profileId: "profile-id",
      displayName: "Efua Mensah",
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
