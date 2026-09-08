"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  type AddUnitFormValues,
  addUnitSchema,
  UNIT_KIND_OPTIONS,
} from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

interface AddUnitFormProps {
  buildingId: Id<"buildings">;
  buildingName: string;
  unitId?: Id<"units">;
  initialValues?: AddUnitFormValues;
}

const AddUnitForm: React.FC<AddUnitFormProps> = ({
  buildingId,
  buildingName,
  unitId,
  initialValues,
}) => {
  const router = useRouter();
  const createUnit = useMutation(api.units.create);
  const updateUnit = useMutation(api.units.update);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buildingHref = `/buildings/${buildingId}`;

  const form = useForm<AddUnitFormValues>({
    initialValues: initialValues ?? {
      label: "",
      kind: "apartment",
    },
    validate: zod4Resolver(addUnitSchema),
  });

  const handleSubmit = async (values: AddUnitFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (unitId !== undefined) {
        await updateUnit({
          unitId,
          label: values.label,
          kind: values.kind,
        });
      } else {
        await createUnit({
          buildingId,
          label: values.label,
          kind: values.kind,
        });
      }
      router.replace(buildingHref);
    } catch {
      setError("Could not save this unit. Check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        id="building"
        label="Building"
        value={buildingName}
        readOnly
        classNames={{
          ...INPUT_CLASSNAMES,
          input: `${INPUT_CLASSNAMES.input} bg-sidebar`,
        }}
      />
      <TextInput
        id="label"
        label="Unit label"
        placeholder="e.g. B12"
        withAsterisk
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("label")}
      />
      <Select
        id="kind"
        label="Kind"
        placeholder="Pick a kind"
        data={UNIT_KIND_OPTIONS}
        allowDeselect={false}
        withAsterisk
        pointer
        comboboxProps={{ shadow: "sm" }}
        classNames={{
          label: INPUT_CLASSNAMES.label,
          input: INPUT_CLASSNAMES.input,
          dropdown: "rounded-[8px] border border-border bg-white",
          option:
            "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
        }}
        {...form.getInputProps("kind")}
        onChange={(value) => {
          if (value === "apartment" || value === "commercial") {
            form.setFieldValue("kind", value);
          }
        }}
      />
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Group
        justify="flex-end"
        gap="md"
        className="w-full flex-col pt-6 sm:flex-row"
      >
        <Button
          type="button"
          variant="subtle"
          onClick={() => router.push(buildingHref)}
          className="h-auto w-full px-6 py-3 text-[15px] font-semibold text-grey hover:text-darkGrey sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Save unit
        </Button>
      </Group>
    </form>
  );
};

export default AddUnitForm;
