import { screen } from "@testing-library/react";

import { render } from "@/test-utils";

import AddTenantPage from "./AddTenantPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => jest.fn(),
  useAction: () => jest.fn(),
  useQuery: () => [],
}));

describe("AddTenantPage", () => {
  it("shows the add tenant form", () => {
    render(
      <AddTenantPage
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        units={[{ _id: "unit-1", label: "B12" }]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Add tenant" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ridge Court" })).toHaveAttribute(
      "href",
      "/buildings/building-id"
    );
    expect(
      screen.getByRole("button", { name: "Save tenant" })
    ).toBeInTheDocument();
  });

  it("fills the form when a saved tenant is opened", () => {
    render(
      <AddTenantPage
        buildingId={"building-id" as never}
        buildingName="Ridge Court"
        units={[{ _id: "unit-1", label: "B12" }]}
        unitLabel="B12"
        leaseId={"lease-id" as never}
        lockUnit
        initialValues={{
          unitId: "unit-1",
          displayName: "Akosua Darko",
          phone: "024 111 2222",
          email: "akosua@example.com",
          startedOn: "2024-01-15",
          endedOn: "2027-12-31",
          password: "",
        }}
      />
    );

    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
      "Akosua Darko"
    );
    expect(screen.getByLabelText(/email/i)).toHaveValue("akosua@example.com");
    expect(screen.getByText("B12")).toBeInTheDocument();
  });
});
