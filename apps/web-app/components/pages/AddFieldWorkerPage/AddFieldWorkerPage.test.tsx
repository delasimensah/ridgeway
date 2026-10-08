import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddFieldWorkerPage from "./AddFieldWorkerPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
  useAction: () => jest.fn(),
}));

describe("AddFieldWorkerPage", () => {
  it("shows the add field worker form", () => {
    render(<AddFieldWorkerPage />);

    expect(
      screen.getByRole("heading", { name: "Add field worker" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "href",
      "/users"
    );
    expect(
      screen.getByRole("textbox", { name: /^full name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save field worker" })
    ).toBeInTheDocument();
  });
});
