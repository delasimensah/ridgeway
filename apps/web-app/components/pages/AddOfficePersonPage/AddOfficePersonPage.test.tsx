import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddOfficePersonPage from "./AddOfficePersonPage";

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

describe("AddOfficePersonPage", () => {
  it("shows the add office person form", () => {
    render(<AddOfficePersonPage />);

    expect(
      screen.getByRole("heading", { name: "Add office person" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Office" })).toHaveAttribute(
      "href",
      "/office"
    );
    expect(
      screen.getByRole("textbox", { name: /^full name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save office person" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved office person is opened", () => {
    render(
      <AddOfficePersonPage
        profileId={"profile-id" as never}
        initialValues={{
          displayName: "Efua Mensah",
          email: "efua.mensah@ridgeway.gh",
          password: "",
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Edit office person" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^full name/i })).toHaveValue(
      "Efua Mensah"
    );
    expect(screen.getByRole("textbox", { name: /^email/i })).toHaveValue(
      "efua.mensah@ridgeway.gh"
    );
  });
});
