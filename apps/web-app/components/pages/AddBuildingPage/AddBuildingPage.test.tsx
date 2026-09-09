import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddBuildingPage from "./AddBuildingPage";

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

describe("AddBuildingPage", () => {
  it("shows the add building form", () => {
    render(<AddBuildingPage />);

    expect(
      screen.getByRole("heading", { name: "Add building" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save building" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved building is opened", () => {
    render(
      <AddBuildingPage
        buildingId={"building-id" as never}
        initialValues={{
          name: "Ridge Court",
          street: "14 Ridge Road",
          area: "Cantonments",
        }}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue("Ridge Court");
    expect(screen.getByLabelText(/street/i)).toHaveValue("14 Ridge Road");
    expect(screen.getByLabelText(/area/i)).toHaveValue("Cantonments");
  });
});
