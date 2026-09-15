import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { type Href, router } from "expo-router";
import { useState } from "react";

import { TenantFileRepairScreen } from "@/components";
import { useFieldSession } from "@/hooks";
import {
  COMPLETION_IMAGE_PICKER_OPTIONS,
  getConvexErrorMessage,
  readCompletionPhotoAsset,
  type RepairCategory,
  type RepairUrgency,
  uploadRepairPhoto,
} from "@/utils";

const TenantFileRepairRoute = () => {
  const { currentLease } = useFieldSession();
  const createRepair = useMutation(api.workOrders.createByTenant);
  const createUploadUrl = useMutation(api.files.createUploadUrl);
  const attachToWorkOrder = useMutation(api.files.attachToWorkOrder);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RepairCategory | "">("");
  const [urgency, setUrgency] = useState<RepairUrgency | "">("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickPhoto = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const result = camera.granted
      ? await ImagePicker.launchCameraAsync(COMPLETION_IMAGE_PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(
          COMPLETION_IMAGE_PICKER_OPTIONS
        );
    if (result.canceled) {
      return;
    }
    try {
      const photo = readCompletionPhotoAsset(result.assets[0]);
      setPhotoUri(photo.uri);
      setMimeType(photo.mimeType);
      setError(null);
    } catch (caught) {
      setPhotoUri(null);
      setMimeType(null);
      setError(getConvexErrorMessage(caught, "Choose a photo, not a video"));
    }
  };

  const handleSubmit = async () => {
    if (currentLease === null) {
      return;
    }
    const trimmed = description.trim();
    if (trimmed.length === 0) {
      setError("What’s wrong is required");
      return;
    }
    if (category === "") {
      setError("Category is required");
      return;
    }
    if (urgency === "") {
      setError("Urgency is required");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const workOrderId = await createRepair({
        unitId: currentLease.unitId as Id<"units">,
        description: trimmed,
        category,
        urgency,
      });
      if (photoUri !== null) {
        await uploadRepairPhoto({
          workOrderId,
          uri: photoUri,
          mimeType,
          createUploadUrl,
          attachToWorkOrder,
        });
      }
      router.replace(`/(tenant-app)/repair/${workOrderId}` as Href);
    } catch (caught) {
      setError(getConvexErrorMessage(caught));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TenantFileRepairScreen
      buildingName={currentLease?.buildingName ?? ""}
      unitLabel={currentLease?.unitLabel ?? ""}
      description={description}
      category={category}
      urgency={urgency}
      photoUri={photoUri}
      isSubmitting={isSubmitting}
      error={error}
      onChangeDescription={setDescription}
      onChangeCategory={setCategory}
      onChangeUrgency={setUrgency}
      onPickPhoto={() => {
        void handlePickPhoto();
      }}
      onSubmit={() => {
        void handleSubmit();
      }}
      onBack={() => {
        router.back();
      }}
    />
  );
};

export default TenantFileRepairRoute;
