"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  type FileRepairFormValues,
  fileRepairSchema,
  getConvexErrorInfo,
  REPAIR_CATEGORY_OPTIONS,
  REPAIR_URGENCY_OPTIONS,
  uploadRepairPhoto,
} from "@/utils";

import Text from "../../ui/Text/Text";
import RepairPhotoDropzone from "../RepairPhotoDropzone/RepairPhotoDropzone";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[14px] font-bold uppercase tracking-wider text-grey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const SAVE_ERROR =
  "Could not file this repair. Check the fields and try again.";

interface FileRepairFormProps {
  unitId: Id<"units">;
  initialValues?: Partial<FileRepairFormValues>;
}

const EMPTY_VALUES: FileRepairFormValues = {
  description: "",
  category: "" as FileRepairFormValues["category"],
  urgency: "" as FileRepairFormValues["urgency"],
};

const FileRepairForm: React.FC<FileRepairFormProps> = ({
  unitId,
  initialValues,
}) => {
  const router = useRouter();
  const createRepair = useMutation(api.workOrders.createByTenant);
  const createUploadUrl = useMutation(api.files.createUploadUrl);
  const attachToWorkOrder = useMutation(api.files.attachToWorkOrder);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FileRepairFormValues>({
    initialValues: {
      ...EMPTY_VALUES,
      ...initialValues,
    },
    validate: zod4Resolver(fileRepairSchema),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const workOrderId = await createRepair({
        unitId,
        description: values.description,
        category: values.category,
        urgency: values.urgency,
      });
      if (photo !== null) {
        await uploadRepairPhoto({
          workOrderId,
          file: photo,
          createUploadUrl,
          attachToWorkOrder,
        });
      }
      router.push(`/repairs/${workOrderId}`);
    } catch (caught) {
      const info = getConvexErrorInfo(caught);
      setError(info.message ?? SAVE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error !== null ? (
        <Text className="text-sm text-overdue">{error}</Text>
      ) : null}
      <Textarea
        label="What’s wrong?"
        placeholder="Describe the issue in detail..."
        minRows={4}
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("description")}
      />
      <Group grow className="flex-col sm:flex-row">
        <Select
          label="Category"
          placeholder="Select category"
          data={REPAIR_CATEGORY_OPTIONS}
          classNames={INPUT_CLASSNAMES}
          {...form.getInputProps("category")}
        />
        <Select
          label="Urgency"
          placeholder="Select urgency"
          data={REPAIR_URGENCY_OPTIONS}
          classNames={INPUT_CLASSNAMES}
          {...form.getInputProps("urgency")}
        />
      </Group>
      <RepairPhotoDropzone value={photo} onChange={setPhoto} />
      <Group gap="sm" className="border-t border-border pt-4">
        <Button type="submit" loading={isSubmitting} className={PRIMARY_BUTTON}>
          Submit repair
        </Button>
        <Button
          component={Link}
          href="/"
          variant="subtle"
          className="h-auto rounded-[8px] px-8 py-3 text-[15px] font-semibold text-grey hover:bg-sidebar"
        >
          Cancel
        </Button>
      </Group>
    </form>
  );
};

export default FileRepairForm;
