import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddOwnerPage from "./AddOwnerPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
  useQuery: () => [],
}));

describe("AddOwnerPage", () => {
  it("shows the add owner form", () => {
    render(<AddOwnerPage />);

    expect(
      screen.getByRole("heading", { name: "Add owner" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save owner" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved owner is opened", () => {
    render(
      <AddOwnerPage
        ownerId={"owner-id" as never}
        initialValues={{
          displayName: "Kwesi Mensah",
          contactEmail: "kwesi@example.com",
          contactPhone: "024 555 0000",
        }}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Kwesi Mensah");
    expect(screen.getByLabelText(/email/i)).toHaveValue("kwesi@example.com");
  });
});
