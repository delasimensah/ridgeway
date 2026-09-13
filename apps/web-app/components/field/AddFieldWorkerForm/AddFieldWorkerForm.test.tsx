import { screen, waitFor } from "@testing-library/react";

import { render, setupUser } from "@/test-utils";

import AddFieldWorkerForm from "./AddFieldWorkerForm";

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
      getFunctionName(ref) === "field:setPassword"
        ? mockSetPassword
        : mockCreate,
  };
});

describe("AddFieldWorkerForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockSetPassword.mockReset();
  });

  it("saves a new field worker", async () => {
    const user = setupUser();
    mockCreate.mockResolvedValue("profile-id");
    render(
      <AddFieldWorkerForm
        initialValues={{
          displayName: "Kofi Asante",
          email: "kofi.asante@ridgeway.gh",
          password: "RidgewayField26",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save field worker" }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        displayName: "Kofi Asante",
        email: "kofi.asante@ridgeway.gh",
        password: "RidgewayField26",
      });
    });
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockSetPassword).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/field");
  });
});
