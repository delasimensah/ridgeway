import { screen, waitFor } from "@testing-library/react";

import { fillField, render, setupUser } from "@/test-utils";
import { demoSignInAccounts, isPublicDemo } from "@/utils";

import SignInForm from "./SignInForm";

jest.mock("@/utils", () => {
  const actual = jest.requireActual<typeof import("@/utils")>("@/utils");
  return {
    ...actual,
    isPublicDemo: jest.fn(() => false),
    demoSignInAccounts: jest.fn(() => []),
  };
});

const mockIsPublicDemo = jest.mocked(isPublicDemo);
const mockDemoSignInAccounts = jest.mocked(demoSignInAccounts);

const mockReplace = jest.fn();
const mockSignIn = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signIn: mockSignIn,
    signOut: jest.fn(),
  }),
}));

describe("SignInForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockSignIn.mockReset();
    mockIsPublicDemo.mockReset();
    mockIsPublicDemo.mockReturnValue(false);
    mockDemoSignInAccounts.mockReset();
    mockDemoSignInAccounts.mockReturnValue([]);
  });

  it("renders email, password, and sign in", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /forgot/i })
    ).not.toBeInTheDocument();
  });

  it("shows a clear error for a wrong password and does not leave the page", async () => {
    const user = setupUser();
    mockSignIn.mockRejectedValue(new Error("Invalid credentials"));
    render(<SignInForm />);

    await fillField(
      user,
      screen.getByLabelText(/email address/i),
      "ama.boateng@ridgeway.gh"
    );
    await fillField(
      user,
      screen.getByPlaceholderText("••••••••"),
      "not-the-password"
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(
        "Email or password is wrong. Check both and try again."
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("signs in with email and password and lands on home", async () => {
    const user = setupUser();
    mockSignIn.mockResolvedValue({ signingIn: true });
    render(<SignInForm />);

    await fillField(
      user,
      screen.getByLabelText(/email address/i),
      "ama.boateng@ridgeway.gh"
    );
    await fillField(
      user,
      screen.getByPlaceholderText("••••••••"),
      "RidgewayOffice26"
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("password", {
        email: "ama.boateng@ridgeway.gh",
        password: "RidgewayOffice26",
        flow: "signIn",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("signs in as the staff, owner, or tenant demo", async () => {
    const user = setupUser();
    mockSignIn.mockResolvedValue({ signingIn: true });
    mockIsPublicDemo.mockReturnValue(true);
    mockDemoSignInAccounts.mockReturnValue([
      {
        label: "Continue as Ama Boateng, staff",
        email: "ama.boateng@ridgeway.gh",
        password: "staff-secret",
      },
      {
        label: "Continue as Naa Densua Lamptey, owner",
        email: "naa.lamptey@ridgeway.gh",
        password: "owner-secret",
      },
      {
        label: "Continue as Aba Gyamfi, tenant",
        email: "aba.gyamfi@ridgeway.gh",
        password: "tenant-secret",
      },
    ]);
    render(<SignInForm />);

    expect(screen.getByText(/changes are not saved/i)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /naa densua lamptey, owner/i })
    );

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("password", {
        email: "naa.lamptey@ridgeway.gh",
        password: "owner-secret",
        flow: "signIn",
      });
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
