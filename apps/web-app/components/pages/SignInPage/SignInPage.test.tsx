import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import SignInPage from "./SignInPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe("SignInPage", () => {
  it("shows the Ridgeway wordmark and staff note", () => {
    render(<SignInPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Ridgeway" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The buildings, the rent, and the repairs, in one place."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Staff, owners, and tenants use this site.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
