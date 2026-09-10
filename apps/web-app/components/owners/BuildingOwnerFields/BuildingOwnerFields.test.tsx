import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@/test-utils";

import BuildingOwnerFields from "./BuildingOwnerFields";

describe("BuildingOwnerFields", () => {
  it("shows contact fields when adding a new owner", async () => {
    const user = userEvent.setup();
    const onOwnerChoice = jest.fn();
    render(
      <BuildingOwnerFields
        owners={[]}
        ownerChoice=""
        onOwnerChoice={onOwnerChoice}
      >
        <span>Owner fields</span>
      </BuildingOwnerFields>
    );

    await user.click(screen.getByRole("combobox", { name: /owner/i }));
    await user.click(
      await screen.findByRole("option", {
        name: /Add a new owner/i,
        hidden: true,
      })
    );

    expect(onOwnerChoice).toHaveBeenCalledWith("__new_owner__");
  });

  it("shows contact fields when the chosen owner has no login", () => {
    render(
      <BuildingOwnerFields
        owners={[
          {
            _id: "owner-1",
            displayName: "Kwesi Mensah",
            hasLogin: false,
          },
        ]}
        ownerChoice="owner-1"
        onOwnerChoice={jest.fn()}
      >
        <span>Owner fields</span>
      </BuildingOwnerFields>
    );

    expect(screen.getByText("Owner fields")).toBeInTheDocument();
  });

  it("hides contact fields when the chosen owner can already sign in", () => {
    render(
      <BuildingOwnerFields
        owners={[
          {
            _id: "owner-1",
            displayName: "Kwesi Mensah",
            hasLogin: true,
          },
        ]}
        ownerChoice="owner-1"
        onOwnerChoice={jest.fn()}
      >
        <span>Owner fields</span>
      </BuildingOwnerFields>
    );

    expect(screen.queryByText("Owner fields")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "This person can already sign in. They will see only buildings linked to them."
      )
    ).toBeInTheDocument();
  });
});
