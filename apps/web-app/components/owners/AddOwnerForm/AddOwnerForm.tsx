"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAction, useMutation, useQuery } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  type AddOwnerFormValues,
  addOwnerSchema,
  getConvexErrorInfo,
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

const SAVE_ERROR = "Could not save this owner. Check the fields and try again.";

interface AddOwnerFormProps {
  ownerId?: Id<"owners">;
  buildingId?: Id<"buildings">;
  initialValues?: AddOwnerFormValues & { ownerChoice?: string };
  hasLogin?: boolean;
}

const AddOwnerForm: React.FC<AddOwnerFormProps> = ({
  ownerId,
  buildingId,
  initialValues,
  hasLogin = false,
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
  const grantLogin = useAction(api.owners.grantLogin);
  const setPassword = useAction(api.owners.setPassword);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelHref =
    buildingId !== undefined
      ? `/buildings/${buildingId}`
      : ownerId !== undefined
        ? `/owners/${ownerId}`
        : "/owners";

  const form = useForm<AddOwnerFormValues & { ownerChoice: string }>({
    initialValues: {
      displayName: initialValues?.displayName ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      password: initialValues?.password ?? "",
      ownerChoice:
        initialValues?.ownerChoice ??
        (isAssigningToBuilding ? "" : NEW_OWNER_CHOICE),
    },
    validate: (values) => {
      if (isAssigningToBuilding && values.ownerChoice.length === 0) {
        return { ownerChoice: "Pick an owner or add a new one" };
      }
      const chosen = owners?.find((owner) => owner._id === values.ownerChoice);
      const needsOwnerFields =
        ownerId !== undefined ||
        values.ownerChoice === NEW_OWNER_CHOICE ||
        !isAssigningToBuilding ||
        (chosen !== undefined && chosen.hasLogin !== true);
      if (needsOwnerFields) {
        return zod4Resolver(addOwnerSchema)(values);
      }
      return {};
    },
  });

  const selectedOwner =
    owners?.find((owner) => owner._id === form.values.ownerChoice) ?? null;
  const formHasLogin = hasLogin || selectedOwner?.hasLogin === true;
  const hidePassword =
    isAssigningToBuilding && selectedOwner?.hasLogin === true;

  const handleSubmit = async (
    values: AddOwnerFormValues & { ownerChoice: string }
  ) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const existingOwnerId =
        ownerId ??
        (isAssigningToBuilding &&
        values.ownerChoice !== NEW_OWNER_CHOICE &&
        values.ownerChoice.length > 0
          ? (values.ownerChoice as Id<"owners">)
          : undefined);
      const shouldGrantLogin = !formHasLogin && values.password.length > 0;
      const shouldSetPassword =
        formHasLogin && ownerId !== undefined && values.password.length > 0;

      if (ownerId !== undefined && !shouldGrantLogin) {
        await updateOwner({
          ownerId,
          displayName: values.displayName,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
        });
        if (shouldSetPassword) {
          await setPassword({
            ownerId,
            password: values.password,
          });
        }
      } else if (
        isAssigningToBuilding &&
        values.ownerChoice !== NEW_OWNER_CHOICE &&
        !shouldGrantLogin
      ) {
        await assignOwner({
          buildingId,
          ownerId: values.ownerChoice as Id<"owners">,
        });
      } else if (shouldGrantLogin) {
        await grantLogin({
          ...(existingOwnerId !== undefined
            ? { ownerId: existingOwnerId }
            : {}),
          displayName: values.displayName,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
          password: values.password,
          ...(buildingId !== undefined ? { buildingId } : {}),
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
        withAsterisk={form.values.password.length > 0}
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
      {hidePassword ? null : (
        <PasswordInput
          id="password"
          label="Password"
          placeholder={formHasLogin ? "New password" : "Temporary password"}
          description={
            formHasLogin
              ? "Optional. Leave blank to keep the current password."
              : "Optional. Set one to give this person a website login."
          }
          classNames={INPUT_CLASSNAMES}
          {...form.getInputProps("password")}
        />
      )}
    </>
  );

  const loginNote = formHasLogin
    ? "This person can already sign in. They will see only buildings linked to them."
    : "This person will see only buildings linked to them.";

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      {isAssigningToBuilding ? (
        <BuildingOwnerFields
          owners={owners ?? []}
          ownerChoice={form.values.ownerChoice}
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
          {ownerFields}
        </BuildingOwnerFields>
      ) : (
        <>
          {ownerFields}
          <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
            {loginNote}
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
