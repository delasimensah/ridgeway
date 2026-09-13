import type { Id } from "@convex/_generated/dataModel";

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
  const uploadUrl = await args.createUploadUrl({
    workOrderId: args.workOrderId,
  });
  const response = await fetch(args.uri);
  const blob = await response.blob();
  const upload = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": args.mimeType ?? "image/jpeg" },
    body: blob,
  });
  if (!upload.ok) {
    throw new Error("Could not upload the photo");
  }
  const payload = (await upload.json()) as { storageId: Id<"_storage"> };
  await args.attachToWorkOrder({
    workOrderId: args.workOrderId,
    storageId: payload.storageId,
    kind: "completion",
  });
}
