"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, Select, SimpleGrid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  ACCRA_CITY,
  type AddBuildingFormValues,
  addBuildingSchema,
} from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

export interface BuildingOwnerOption {
  _id: string;
  displayName: string;
}

interface AddBuildingFormProps {
  buildingId?: Id<"buildings">;
  owners?: BuildingOwnerOption[];
  initialValues?: AddBuildingFormValues;
}

const AddBuildingForm: React.FC<AddBuildingFormProps> = ({
  buildingId,
  owners = [],
  initialValues,
}) => {
  const router = useRouter();
  const createBuilding = useMutation(api.buildings.create);
  const updateBuilding = useMutation(api.buildings.update);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddBuildingFormValues>({
    initialValues: initialValues ?? {
      name: "",
      street: "",
      area: "",
      ownerId: "",
    },
    validate: zod4Resolver(addBuildingSchema),
  });

  const handleSubmit = async (values: AddBuildingFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const ownerId =
        values.ownerId !== undefined && values.ownerId.length > 0
          ? (values.ownerId as Id<"owners">)
          : undefined;

      if (buildingId !== undefined) {
        await updateBuilding({
          buildingId,
          name: values.name,
          street: values.street,
          area: values.area,
          ...(ownerId !== undefined ? { ownerId } : {}),
        });
      } else {
        await createBuilding({
          name: values.name,
          street: values.street,
          area: values.area,
          ...(ownerId !== undefined ? { ownerId } : {}),
        });
      }
      router.replace("/buildings");
    } catch {
      setError("Could not save this building. Check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        id="name"
        label="Name"
        placeholder="e.g. Ridge Court"
        withAsterisk
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("name")}
      />
      <Select
        id="ownerId"
        label="Owner"
        placeholder={
          owners.length === 0 ? "Add an owner first" : "Pick an owner"
        }
        data={owners.map((owner) => ({
          value: owner._id,
          label: owner.displayName,
        }))}
        clearable
        pointer
        comboboxProps={{ shadow: "sm" }}
        classNames={{
          label: INPUT_CLASSNAMES.label,
          input: INPUT_CLASSNAMES.input,
          dropdown: "rounded-[8px] border border-border bg-white",
          option:
            "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
        }}
        {...form.getInputProps("ownerId")}
      />
      <TextInput
        id="street"
        label="Street"
        placeholder="e.g. 14 Ridge Road"
        withAsterisk
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("street")}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
        <TextInput
          id="area"
          label="Area"
          placeholder="Cantonments"
          withAsterisk
          classNames={INPUT_CLASSNAMES}
          {...form.getInputProps("area")}
        />
        <TextInput
          id="city"
          label="City"
          value={ACCRA_CITY}
          readOnly
          classNames={{
            ...INPUT_CLASSNAMES,
            input: `${INPUT_CLASSNAMES.input} bg-sidebar`,
          }}
        />
      </SimpleGrid>
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Group
        justify="flex-end"
        gap="md"
        className="w-full flex-col pt-6 sm:flex-row"
      >
        <Button
          type="button"
          variant="subtle"
          onClick={() => router.push("/buildings")}
          className="h-auto w-full px-6 py-3 text-[15px] font-semibold text-grey hover:text-darkGrey sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Save building
        </Button>
      </Group>
    </form>
  );
};

export default AddBuildingForm;
