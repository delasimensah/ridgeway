import { screen, waitFor } from "@testing-library/react";

import { render, setupUser } from "@/test-utils";

import AssignRepairForm from "./AssignRepairForm";

const mockAssign = jest.fn();

jest.mock("convex/react", () => ({
  useMutation: () => mockAssign,
}));

describe("AssignRepairForm", () => {
  beforeEach(() => {
    mockAssign.mockReset();
  });

  it("assigns the selected field worker", async () => {
    const user = setupUser();
    mockAssign.mockResolvedValue(null);
    render(
      <AssignRepairForm
        workOrderId={"wo-1" as never}
        fieldWorkers={[{ _id: "field-1", displayName: "Yaw Darko" }]}
        initialValues={{ assigneeProfileId: "field-1" }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Assign" }));

    await waitFor(() => {
      expect(mockAssign).toHaveBeenCalledWith({
        workOrderId: "wo-1",
        assigneeProfileId: "field-1",
      });
    });
  });
});
