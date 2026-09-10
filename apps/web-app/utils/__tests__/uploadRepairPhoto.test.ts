import { uploadRepairPhoto } from "../uploadRepairPhoto";

describe("uploadRepairPhoto", () => {
  it("posts the file then attaches the storage id", async () => {
    const createUploadUrl = jest
      .fn()
      .mockResolvedValue("https://example.com/upload");
    const attachToWorkOrder = jest.fn().mockResolvedValue("file-1");
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ storageId: "storage-1" }),
    });
    global.fetch = fetchMock;

    await uploadRepairPhoto({
      workOrderId: "wo-1" as never,
      file: new File(["tap"], "tap.jpg", { type: "image/jpeg" }),
      createUploadUrl,
      attachToWorkOrder,
    });

    expect(createUploadUrl).toHaveBeenCalledWith({ workOrderId: "wo-1" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/upload",
      expect.objectContaining({ method: "POST" })
    );
    expect(attachToWorkOrder).toHaveBeenCalledWith({
      workOrderId: "wo-1",
      storageId: "storage-1",
      kind: "repair",
    });
  });
});
