import { screen } from "@testing-library/react";
import React, { useState } from "react";

import { render, setupUser } from "@/test-utils";

import RepairPhotoDropzone from "./RepairPhotoDropzone";

function DropzoneHarness() {
  const [file, setFile] = useState<File | null>(null);
  return <RepairPhotoDropzone value={file} onChange={setFile} />;
}

describe("RepairPhotoDropzone", () => {
  it("shows the locked photo copy", () => {
    render(<RepairPhotoDropzone value={null} onChange={jest.fn()} />);

    expect(screen.getByText("Photo")).toBeInTheDocument();
    expect(screen.getByText("Add a photo")).toBeInTheDocument();
    expect(screen.getByText("PNG, JPG up to 10MB")).toBeInTheDocument();
  });

  it("shows a preview of the selected photo", async () => {
    const user = setupUser();
    const previewUrl = "blob:http://localhost/repair-photo";
    const createObjectURL = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue(previewUrl);
    const revokeObjectURL = jest
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => undefined);

    render(<DropzoneHarness />);

    const file = new File(["leak"], "leak.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Add a photo"), file);

    const preview = await screen.findByRole("img", { name: "leak.png" });
    expect(preview).toHaveAttribute("src", previewUrl);
    expect(screen.getByText("leak.png")).toBeInTheDocument();

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
  });
});
