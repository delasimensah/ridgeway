import { screen } from "@testing-library/react";
import React from "react";

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
  it("shows the Ridgeway wordmark and office note", () => {
    render(<SignInPage />);

    expect(
      screen.getByRole("heading", { name: "Ridgeway" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Office, owners, and tenants use this site.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
