"use client";

import { Image, Stack } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCamera } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";

import Text from "../../ui/Text/Text";

const PHOTO_INPUT_ID = "repair-photo";
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const REJECT_MESSAGE = "Use a PNG or JPG up to 10MB.";

const LABEL_CLASS =
  "mb-2 text-[14px] font-bold uppercase tracking-wider text-grey";

interface RepairPhotoDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

const RepairPhotoDropzone: React.FC<RepairPhotoDropzoneProps> = ({
  value,
  onChange,
}) => {
  const [rejectError, setRejectError] = useState<string | null>(null);
  const previewUrl = useMemo(() => {
    if (value === null) {
      return null;
    }
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    if (previewUrl === null) {
      return;
    }
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <Stack gap={0}>
      <Text component="label" htmlFor={PHOTO_INPUT_ID} className={LABEL_CLASS}>
        Photo
      </Text>
      <Dropzone
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
        maxSize={MAX_PHOTO_BYTES}
        maxFiles={1}
        multiple={false}
        radius={8}
        inputProps={{ id: PHOTO_INPUT_ID, "aria-label": "Add a photo" }}
        onDrop={(files) => {
          setRejectError(null);
          onChange(files[0] ?? null);
        }}
        onReject={() => {
          setRejectError(REJECT_MESSAGE);
        }}
        classNames={{
          root: "group cursor-pointer border-2 border-dashed border-border !bg-sidebar/30 p-8 hover:!bg-sidebar/50 data-[accept]:!bg-sidebar/50 data-[reject]:!border-overdue",
          inner: "flex flex-col items-center",
        }}
      >
        <Stack align="center" gap={0} className="pointer-events-none">
          {value !== null && previewUrl !== null ? (
            <Image
              src={previewUrl}
              alt={value.name}
              fit="contain"
              radius={8}
              className="mb-2 max-h-48 w-auto"
            />
          ) : (
            <IconCamera
              size={24}
              className="mb-2 text-grey group-hover:text-darkGrey"
            />
          )}
          <Text className="text-[14px] font-medium text-grey">
            {value?.name ?? "Add a photo"}
          </Text>
          <Text className="mt-1 text-[12px] text-grey/70">
            PNG, JPG up to 10MB
          </Text>
        </Stack>
      </Dropzone>
      {rejectError !== null ? (
        <Text className="mt-2 text-sm text-overdue">{rejectError}</Text>
      ) : null}
    </Stack>
  );
};

export default RepairPhotoDropzone;
