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
});
