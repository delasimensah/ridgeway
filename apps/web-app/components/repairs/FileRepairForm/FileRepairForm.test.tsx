import { screen, waitFor } from "@testing-library/react";

import { render, setupUser } from "@/test-utils";

import FileRepairForm from "./FileRepairForm";

const mockPush = jest.fn();
const mockMutate = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("convex/react", () => ({
  useMutation: () => mockMutate,
}));

describe("FileRepairForm", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockMutate.mockReset();
  });

  it("submits a repair without a photo", async () => {
    const user = setupUser();
    mockMutate.mockResolvedValue("wo-1");
    render(<FileRepairForm unitId={"unit-1" as never} />);

    expect(screen.getByText("Add a photo")).toBeInTheDocument();
    expect(screen.getByText("PNG, JPG up to 10MB")).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: /what’s wrong/i }),
      "Kitchen tap leak"
    );
    await user.click(screen.getByRole("combobox", { name: /category/i }));
    await user.click(
      await screen.findByRole("option", { name: "Plumbing", hidden: true })
    );
    await user.click(screen.getByRole("combobox", { name: /urgency/i }));
    await user.click(
      await screen.findByRole("option", { name: "Medium", hidden: true })
    );
    await user.click(screen.getByRole("button", { name: "Submit repair" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        unitId: "unit-1",
        description: "Kitchen tap leak",
        category: "plumbing",
        urgency: "normal",
      });
    });
    expect(mockPush).toHaveBeenCalledWith("/repairs/wo-1");
  });
});
