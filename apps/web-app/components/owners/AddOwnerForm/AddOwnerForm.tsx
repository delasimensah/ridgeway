"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  type AddOwnerFormValues,
  addOwnerSchema,
  NEW_OWNER_CHOICE,
} from "@/utils";

import Text from "../../ui/Text/Text";
import BuildingOwnerFields from "../BuildingOwnerFields/BuildingOwnerFields";

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
  const isAssigningToBuilding =
    buildingId !== undefined && ownerId === undefined;
  const owners = useQuery(
    api.owners.listForStaff,
    isAssigningToBuilding ? {} : "skip"
  );
  const createOwner = useMutation(api.owners.create);
  const updateOwner = useMutation(api.owners.update);
  const assignOwner = useMutation(api.buildings.assignOwner);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelHref =
    buildingId !== undefined ? `/buildings/${buildingId}` : "/buildings";

  const form = useForm<AddOwnerFormValues & { ownerChoice: string }>({
    initialValues: {
      displayName: initialValues?.displayName ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      ownerChoice: isAssigningToBuilding ? "" : NEW_OWNER_CHOICE,
    },
    validate: (values) => {
      if (isAssigningToBuilding && values.ownerChoice.length === 0) {
        return { ownerChoice: "Pick an owner or add a new one" };
      }
      if (
        ownerId !== undefined ||
        values.ownerChoice === NEW_OWNER_CHOICE ||
        !isAssigningToBuilding
      ) {
        return zod4Resolver(addOwnerSchema)(values);
      }
      return {};
    },
  });

  const handleSubmit = async (
    values: AddOwnerFormValues & { ownerChoice: string }
  ) => {
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
      } else if (
        isAssigningToBuilding &&
        values.ownerChoice !== NEW_OWNER_CHOICE
      ) {
        await assignOwner({
          buildingId,
          ownerId: values.ownerChoice as Id<"owners">,
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

  const ownerFields = (
    <>
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
    </>
  );

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      {isAssigningToBuilding ? (
        <BuildingOwnerFields
          owners={owners ?? []}
          ownerChoice={form.values.ownerChoice}
          onOwnerChoice={(value) => {
            form.setFieldValue("ownerChoice", value);
          }}
          ownerChoiceError={form.errors.ownerChoice}
        >
          {ownerFields}
        </BuildingOwnerFields>
      ) : (
        <>
          {ownerFields}
          <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
            This person will see only buildings linked to them.
          </Text>
        </>
      )}
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
