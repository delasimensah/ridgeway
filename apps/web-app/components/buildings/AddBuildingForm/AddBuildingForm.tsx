"use client";

import { api } from "@convex/_generated/api";
import { Button, Group, SimpleGrid, TextInput } from "@mantine/core";
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

const AddBuildingForm: React.FC = () => {
  const router = useRouter();
  const createBuilding = useMutation(api.buildings.create);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddBuildingFormValues>({
    initialValues: {
      name: "",
      street: "",
      area: "",
    },
    validate: zod4Resolver(addBuildingSchema),
  });

  const handleSubmit = async (values: AddBuildingFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createBuilding({
        name: values.name,
        street: values.street,
        area: values.area,
      });
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
