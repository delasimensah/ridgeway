"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  Button,
  Group,
  PasswordInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAction, useMutation, useQuery } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useWritesLocked } from "@/hooks";
import {
  ACCRA_CITY,
  type AddBuildingFormValues,
  addBuildingSchema,
  blockDemoSave,
  getConvexErrorInfo,
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

const SAVE_ERROR =
  "Could not save this building. Check the fields and try again.";

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
  password: "",
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
  const grantLogin = useAction(api.owners.grantLogin);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const writesLocked = useWritesLocked();

  const form = useForm<AddBuildingFormValues>({
    initialValues: {
      ...EMPTY_VALUES,
      ...initialValues,
    },
    validate: zod4Resolver(addBuildingSchema),
  });

  const selectedOwner =
    owners?.find((owner) => owner._id === form.values.ownerChoice) ?? null;
  const formHasLogin = selectedOwner?.hasLogin === true;

  const handleSubmit = async (values: AddBuildingFormValues) => {
    if (blockDemoSave(writesLocked, setError)) {
      return;
    }
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
        const password = values.password ?? "";
        const shouldGrantLogin = password.length > 0 && !formHasLogin;
        let ownerId: Id<"owners"> | undefined;

        if (shouldGrantLogin) {
          ownerId = await grantLogin({
            ...(ownerChoice !== NEW_OWNER_CHOICE && ownerChoice.length > 0
              ? { ownerId: ownerChoice as Id<"owners"> }
              : {}),
            displayName: values.displayName ?? "",
            contactEmail: values.contactEmail ?? "",
            contactPhone: values.contactPhone,
            password,
          });
        }

        await createBuilding({
          name: values.name,
          street: values.street,
          area: values.area,
          ...(ownerId !== undefined
            ? { ownerId }
            : ownerChoice === NEW_OWNER_CHOICE
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
    } catch (caught) {
      const info = getConvexErrorInfo(caught);
      if (info.code === "NOT_PERMITTED" || info.message === "NOT_PERMITTED") {
        setError(SAVE_ERROR);
      } else {
        setError(info.message.length > 0 ? info.message : SAVE_ERROR);
      }
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
            const selected = owners?.find((owner) => owner._id === value);
            if (selected === undefined) {
              return;
            }
            form.setFieldValue("displayName", selected.displayName);
            form.setFieldValue("contactEmail", selected.contactEmail ?? "");
            form.setFieldValue("contactPhone", selected.contactPhone ?? "");
            form.setFieldValue("password", "");
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
            withAsterisk={(form.values.password ?? "").length > 0}
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
          {formHasLogin ? null : (
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Temporary password"
              description="Optional. Set one to give this person a website login. You cannot change it later from here."
              classNames={INPUT_CLASSNAMES}
              {...form.getInputProps("password")}
            />
          )}
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
          disabled={writesLocked}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Save building
        </Button>
      </Group>
    </form>
  );
};

export default AddBuildingForm;
