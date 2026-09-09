"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, SimpleGrid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  ACCRA_CITY,
  type AddBuildingFormValues,
  addBuildingSchema,
  NEW_OWNER_CHOICE,
} from "@/utils";

import BuildingOwnerFields from "../../owners/BuildingOwnerFields/BuildingOwnerFields";
import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

interface AddBuildingFormProps {
  buildingId?: Id<"buildings">;
  initialValues?: AddBuildingFormValues;
}

const EMPTY_VALUES: AddBuildingFormValues = {
  name: "",
  street: "",
  area: "",
  ownerChoice: "",
  displayName: "",
  contactEmail: "",
  contactPhone: "",
};

const AddBuildingForm: React.FC<AddBuildingFormProps> = ({
  buildingId,
  initialValues,
}) => {
  const router = useRouter();
  const isEditing = buildingId !== undefined;
  const owners = useQuery(api.owners.listForStaff, isEditing ? "skip" : {});
  const createBuilding = useMutation(api.buildings.create);
  const updateBuilding = useMutation(api.buildings.update);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddBuildingFormValues>({
    initialValues: {
      ...EMPTY_VALUES,
      ...initialValues,
    },
    validate: zod4Resolver(addBuildingSchema),
  });

  const handleSubmit = async (values: AddBuildingFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (buildingId !== undefined) {
        await updateBuilding({
          buildingId,
          name: values.name,
          street: values.street,
          area: values.area,
        });
      } else {
        const ownerChoice = values.ownerChoice ?? "";
        await createBuilding({
          name: values.name,
          street: values.street,
          area: values.area,
          ...(ownerChoice === NEW_OWNER_CHOICE
            ? {
                newOwner: {
                  displayName: values.displayName ?? "",
                  contactEmail: values.contactEmail,
                  contactPhone: values.contactPhone,
                },
              }
            : ownerChoice.length > 0
              ? { ownerId: ownerChoice as Id<"owners"> }
              : {}),
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
      {isEditing ? null : (
        <BuildingOwnerFields
          owners={owners ?? []}
          ownerChoice={form.values.ownerChoice ?? ""}
          onOwnerChoice={(value) => {
            form.setFieldValue("ownerChoice", value);
          }}
          ownerChoiceError={form.errors.ownerChoice}
        >
          <TextInput
            id="displayName"
            label="Full name"
            placeholder="Kwesi Mensah"
            withAsterisk
            classNames={INPUT_CLASSNAMES}
            {...form.getInputProps("displayName")}
          />
          <TextInput
            id="contactEmail"
            label="Email"
            type="email"
            placeholder="kwesi@example.com"
            classNames={INPUT_CLASSNAMES}
            {...form.getInputProps("contactEmail")}
          />
          <TextInput
            id="contactPhone"
            label="Phone"
            type="tel"
            placeholder="024 555 0000"
            classNames={INPUT_CLASSNAMES}
            {...form.getInputProps("contactPhone")}
          />
        </BuildingOwnerFields>
      )}
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
