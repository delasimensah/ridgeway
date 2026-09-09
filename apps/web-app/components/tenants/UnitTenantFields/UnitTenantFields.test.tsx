import type { UseFormReturnType } from "@mantine/form";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";
import { type AddUnitFormValues, NEW_TENANT_CHOICE } from "@/utils";

import UnitTenantFields from "./UnitTenantFields";

function mockForm(
  values: Partial<AddUnitFormValues>
): UseFormReturnType<AddUnitFormValues> {
  return {
    getInputProps: (name: string) => ({ name }),
    values: {
      label: "",
      kind: "apartment",
      tenantChoice: "",
      displayName: "",
      phone: "",
      email: "",
      startedOn: "",
      endedOn: "",
      ...values,
    },
    errors: {},
    setFieldValue: jest.fn(),
  } as unknown as UseFormReturnType<AddUnitFormValues>;
}

describe("UnitTenantFields", () => {
  it("hides tenant fields until Add a tenant is chosen", async () => {
    const user = userEvent.setup();
    const form = mockForm({});
    render(<UnitTenantFields form={form} />);

    expect(
      screen.queryByRole("textbox", { name: /name/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Leave this empty if the unit is vacant. Pick someone who already rented, or add a new tenant."
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: /tenant/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a tenant/i,
        hidden: true,
      })
    );

    expect(form.setFieldValue).toHaveBeenCalledWith(
      "tenantChoice",
      NEW_TENANT_CHOICE
    );
  });

  it("shows tenant fields when Add a tenant is selected", () => {
    render(
      <UnitTenantFields form={mockForm({ tenantChoice: NEW_TENANT_CHOICE })} />
    );

    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lease start/i)).toBeInTheDocument();
  });

  it("shows lease dates without name fields when a past tenant is selected", () => {
    render(
      <UnitTenantFields
        form={mockForm({ tenantChoice: "profile-1" })}
        tenants={[{ _id: "profile-1", displayName: "Sofia Herrera" }]}
      />
    );

    expect(
      screen.queryByRole("textbox", { name: /name/i })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/lease start/i)).toBeInTheDocument();
  });
});
