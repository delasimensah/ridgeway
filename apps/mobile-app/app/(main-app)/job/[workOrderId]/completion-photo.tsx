import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react";
import * as ImagePicker from "expo-image-picker";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { CompletionPhotoScreen } from "@/components";
import {
  COMPLETION_IMAGE_PICKER_OPTIONS,
  getConvexErrorMessage,
  readCompletionPhotoAsset,
  uploadCompletionPhoto,
} from "@/utils";

const CompletionPhotoRoute = () => {
  const { workOrderId } = useLocalSearchParams<{ workOrderId: string }>();
  const ticket = useQuery(api.workOrders.get, {
    workOrderId: workOrderId as Id<"workOrders">,
  });
  const jobLine =
    ticket.data != null
      ? `${ticket.data.title} · ${ticket.data.buildingName} ${ticket.data.unitLabel}`
      : "";
  const createUploadUrl = useMutation(api.files.createUploadUrl);
  const attachToWorkOrder = useMutation(api.files.attachToWorkOrder);
  const complete = useMutation(api.workOrders.complete);
  const [uri, setUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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
      setUri(photo.uri);
      setMimeType(photo.mimeType);
      setError(null);
    } catch (caught) {
      setUri(null);
      setMimeType(null);
      setError(getConvexErrorMessage(caught, "Choose a photo, not a video"));
    }
  };

  const handleSave = async () => {
    if (uri === null) {
      setError("Add a completion photo");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const id = workOrderId as Id<"workOrders">;
      await uploadCompletionPhoto({
        workOrderId: id,
        uri,
        mimeType,
        createUploadUrl,
        attachToWorkOrder,
      });
      await complete({
        workOrderId: id,
        note: caption.trim().length > 0 ? caption.trim() : undefined,
      });
      router.replace("/(main-app)/(tabs)/jobs" as Href);
    } catch (caught) {
      setError(getConvexErrorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CompletionPhotoScreen
      jobLine={jobLine}
      uri={uri}
      caption={caption}
      isSaving={isSaving}
      error={error}
      onChangeCaption={setCaption}
      onPickPhoto={() => {
        void handlePickPhoto();
      }}
      onSave={() => {
        void handleSave();
      }}
      onBack={() => {
        router.back();
      }}
    />
  );
};

export default CompletionPhotoRoute;
