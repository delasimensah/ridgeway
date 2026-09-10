import type { Id } from "@convex/_generated/dataModel";

export async function uploadRepairPhoto(args: {
  workOrderId: Id<"workOrders">;
  file: File;
  createUploadUrl: (args: { workOrderId: Id<"workOrders"> }) => Promise<string>;
  attachToWorkOrder: (args: {
    workOrderId: Id<"workOrders">;
    storageId: Id<"_storage">;
    kind: "repair";
  }) => Promise<unknown>;
}): Promise<void> {
  const uploadUrl = await args.createUploadUrl({
    workOrderId: args.workOrderId,
  });
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": args.file.type },
    body: args.file,
  });
  if (!response.ok) {
    throw new Error("Could not upload the photo");
  }
  const payload = (await response.json()) as { storageId: Id<"_storage"> };
  await args.attachToWorkOrder({
    workOrderId: args.workOrderId,
    storageId: payload.storageId,
    kind: "repair",
  });
}
