import { uploadCompletionPhoto } from "../uploadCompletionPhoto";

describe("uploadCompletionPhoto", () => {
  it("uploads the file then attaches it", async () => {
    const createUploadUrl = jest
      .fn()
      .mockResolvedValue("https://upload.example");
    const attachToWorkOrder = jest.fn().mockResolvedValue("file-1");
    globalThis.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        blob: async () => new Blob(["photo"]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ storageId: "storage-1" }),
      }) as jest.Mock;

    await uploadCompletionPhoto({
      workOrderId: "wo-1" as never,
      uri: "file://photo.jpg",
      mimeType: "image/jpeg",
      createUploadUrl,
      attachToWorkOrder,
    });

    expect(createUploadUrl).toHaveBeenCalledWith({ workOrderId: "wo-1" });
    expect(attachToWorkOrder).toHaveBeenCalledWith({
      workOrderId: "wo-1",
      storageId: "storage-1",
      kind: "completion",
    });
  });
});
