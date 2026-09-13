import * as FileSystem from "expo-file-system/legacy";

import {
  readCompletionPhotoAsset,
  uploadCompletionPhoto,
} from "../uploadCompletionPhoto";

describe("uploadCompletionPhoto", () => {
  it("uploads the file then attaches it", async () => {
    const createUploadUrl = jest
      .fn()
      .mockResolvedValue("https://upload.example");
    const attachToWorkOrder = jest.fn().mockResolvedValue("file-1");
    (FileSystem.uploadAsync as jest.Mock).mockResolvedValue({
      status: 200,
      body: JSON.stringify({ storageId: "storage-1" }),
    });

    await uploadCompletionPhoto({
      workOrderId: "wo-1" as never,
      uri: "file://photo.jpg",
      mimeType: "image/jpeg",
      createUploadUrl,
      attachToWorkOrder,
    });

    expect(createUploadUrl).toHaveBeenCalledWith({ workOrderId: "wo-1" });
    expect(FileSystem.uploadAsync).toHaveBeenCalledWith(
      "https://upload.example",
      "file://photo.jpg",
      expect.objectContaining({
        httpMethod: "POST",
        headers: { "Content-Type": "image/jpeg" },
      })
    );
    expect(attachToWorkOrder).toHaveBeenCalledWith({
      workOrderId: "wo-1",
      storageId: "storage-1",
      kind: "completion",
    });
  });
});

describe("readCompletionPhotoAsset", () => {
  it("refuses a video", () => {
    expect(() =>
      readCompletionPhotoAsset({
        uri: "file://clip.mp4",
        mimeType: "video/mp4",
        type: "video",
      } as never)
    ).toThrow("Choose a photo, not a video");
  });
});
