"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { type AddOwnerFormValues, addOwnerSchema } from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

interface AddOwnerFormProps {
  ownerId?: Id<"owners">;
  buildingId?: Id<"buildings">;
  initialValues?: AddOwnerFormValues;
}

const AddOwnerForm: React.FC<AddOwnerFormProps> = ({
  ownerId,
  buildingId,
  initialValues,
}) => {
  const router = useRouter();
  const createOwner = useMutation(api.owners.create);
  const updateOwner = useMutation(api.owners.update);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelHref =
    buildingId !== undefined ? `/buildings/${buildingId}` : "/buildings";

  const form = useForm<AddOwnerFormValues>({
    initialValues: initialValues ?? {
      displayName: "",
      contactEmail: "",
      contactPhone: "",
    },
    validate: zod4Resolver(addOwnerSchema),
  });

  const handleSubmit = async (values: AddOwnerFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (ownerId !== undefined) {
        await updateOwner({
          ownerId,
          displayName: values.displayName,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
        });
      } else {
        await createOwner({
          displayName: values.displayName,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
          ...(buildingId !== undefined ? { buildingId } : {}),
        });
      }
      router.replace(cancelHref);
    } catch {
      setError("Could not save this owner. Check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
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
      <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
        This person will see only buildings linked to them.
      </Text>
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Group
        justify="flex-end"
        gap="md"
        className="w-full flex-col pt-4 sm:flex-row"
      >
        <Button
          type="button"
          variant="subtle"
          onClick={() => router.push(cancelHref)}
          className="h-auto w-full px-6 py-3 text-[15px] font-semibold text-grey hover:text-darkGrey sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Save owner
        </Button>
      </Group>
    </form>
  );
};

export default AddOwnerForm;
