import type { Id } from "@convex/_generated/dataModel";
import * as FileSystem from "expo-file-system/legacy";
import type { ImagePickerAsset } from "expo-image-picker";
import { UIImagePickerPreferredAssetRepresentationMode } from "expo-image-picker";

export const COMPLETION_IMAGE_PICKER_OPTIONS = {
  mediaTypes: ["images"] as ["images"],
  quality: 0.8,
  preferredAssetRepresentationMode:
    UIImagePickerPreferredAssetRepresentationMode.Compatible,
};

export function photoContentType(mimeType?: string | null): string {
  if (mimeType === "image/jpg") {
    return "image/jpeg";
  }
  if (mimeType && mimeType.startsWith("image/")) {
    return mimeType;
  }
  return "image/jpeg";
}

export function readCompletionPhotoAsset(asset: ImagePickerAsset): {
  uri: string;
  mimeType: string;
} {
  if (asset.type === "video" || asset.mimeType?.startsWith("video/")) {
    throw new Error("Choose a photo, not a video");
  }
  return {
    uri: asset.uri,
    mimeType: photoContentType(asset.mimeType),
  };
}

async function uploadToStorage(args: {
  workOrderId: Id<"workOrders">;
  uri: string;
  mimeType?: string | null;
  createUploadUrl: (args: { workOrderId: Id<"workOrders"> }) => Promise<string>;
}): Promise<Id<"_storage">> {
  const uploadUrl = await args.createUploadUrl({
    workOrderId: args.workOrderId,
  });
  const result = await FileSystem.uploadAsync(uploadUrl, args.uri, {
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: { "Content-Type": photoContentType(args.mimeType) },
  });
  if (result.status < 200 || result.status >= 300) {
    throw new Error("Could not upload the photo");
  }
  const payload = JSON.parse(result.body) as { storageId?: Id<"_storage"> };
  if (payload.storageId === undefined) {
    throw new Error("Could not upload the photo");
  }
  return payload.storageId;
}

export async function uploadCompletionPhoto(args: {
  workOrderId: Id<"workOrders">;
  uri: string;
  mimeType?: string | null;
  createUploadUrl: (args: { workOrderId: Id<"workOrders"> }) => Promise<string>;
  attachToWorkOrder: (args: {
    workOrderId: Id<"workOrders">;
    storageId: Id<"_storage">;
    kind: "completion";
  }) => Promise<unknown>;
}): Promise<void> {
  const storageId = await uploadToStorage(args);
  await args.attachToWorkOrder({
    workOrderId: args.workOrderId,
    storageId,
    kind: "completion",
  });
}

export async function uploadRepairPhoto(args: {
  workOrderId: Id<"workOrders">;
  uri: string;
  mimeType?: string | null;
  createUploadUrl: (args: { workOrderId: Id<"workOrders"> }) => Promise<string>;
  attachToWorkOrder: (args: {
    workOrderId: Id<"workOrders">;
    storageId: Id<"_storage">;
    kind: "repair";
  }) => Promise<unknown>;
}): Promise<void> {
  const storageId = await uploadToStorage(args);
  await args.attachToWorkOrder({
    workOrderId: args.workOrderId,
    storageId,
    kind: "repair",
  });
}
