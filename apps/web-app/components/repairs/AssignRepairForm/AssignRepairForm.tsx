"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import React, { useState } from "react";

import { useWritesLocked } from "@/hooks";
import {
  type AssignRepairFormValues,
  assignRepairSchema,
  blockDemoSave,
  getConvexErrorInfo,
} from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[13px] font-bold uppercase tracking-wider text-grey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2 text-[15px] font-semibold text-white hover:bg-primaryHover";

export interface FieldWorkerOption {
  _id: string;
  displayName: string;
}

interface AssignRepairFormProps {
  workOrderId: Id<"workOrders">;
  fieldWorkers: FieldWorkerOption[];
  initialValues?: AssignRepairFormValues;
}

const AssignRepairForm: React.FC<AssignRepairFormProps> = ({
  workOrderId,
  fieldWorkers,
  initialValues,
}) => {
  const assign = useMutation(api.workOrders.assign);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const writesLocked = useWritesLocked();
  const form = useForm<AssignRepairFormValues>({
    initialValues: {
      assigneeProfileId: initialValues?.assigneeProfileId ?? "",
    },
    validate: zod4Resolver(assignRepairSchema),
  });

  const handleSubmit = async (values: AssignRepairFormValues) => {
    if (blockDemoSave(writesLocked, setError)) {
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await assign({
        workOrderId,
        assigneeProfileId: values.assigneeProfileId as Id<"profiles">,
      });
    } catch (caught) {
      setError(getConvexErrorInfo(caught).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (fieldWorkers.length === 0) {
    return (
      <Text className="text-sm text-grey">
        Add a field worker before assigning this repair.
      </Text>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Select
        id="assigneeProfileId"
        label="Field worker"
        placeholder="Pick a field worker"
        data={fieldWorkers.map((person) => ({
          value: person._id,
          label: person.displayName,
        }))}
        withAsterisk
        className="min-w-[220px] flex-1"
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("assigneeProfileId")}
      />
      {error !== null ? (
        <Text className="text-sm text-overdue">{error}</Text>
      ) : null}
      <Button
        type="submit"
        loading={isSaving}
        disabled={writesLocked}
        className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
      >
        Assign
      </Button>
    </form>
  );
};

export default AssignRepairForm;
