"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAction, useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useWritesLocked } from "@/hooks";
import {
  blockDemoSave,
  type FieldWorkerFormValues,
  fieldWorkerSchema,
  getConvexErrorInfo,
} from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const SAVE_ERROR =
  "Could not save this field worker. Check the fields and try again.";

interface AddFieldWorkerFormProps {
  profileId?: Id<"profiles">;
  initialValues?: FieldWorkerFormValues;
}

const AddFieldWorkerForm: React.FC<AddFieldWorkerFormProps> = ({
  profileId,
  initialValues,
}) => {
  const router = useRouter();
  const isEdit = profileId !== undefined;
  const createPerson = useAction(api.field.create);
  const updatePerson = useMutation(api.field.update);
  const setPassword = useAction(api.field.setPassword);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const writesLocked = useWritesLocked();

  const form = useForm<FieldWorkerFormValues>({
    initialValues: {
      displayName: initialValues?.displayName ?? "",
      email: initialValues?.email ?? "",
      password: initialValues?.password ?? "",
    },
    validate: zod4Resolver(fieldWorkerSchema(isEdit)),
  });

  const handleSubmit = async (values: FieldWorkerFormValues) => {
    if (blockDemoSave(writesLocked, setError)) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updatePerson({
          profileId,
          displayName: values.displayName,
        });
        if (values.password.length > 0) {
          await setPassword({
            profileId,
            password: values.password,
          });
        }
      } else {
        await createPerson({
          displayName: values.displayName,
          email: values.email,
          password: values.password,
        });
      }
      router.replace("/users");
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
        id="displayName"
        label="Full name"
        placeholder="Kofi Asante"
        withAsterisk
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("displayName")}
      />
      <TextInput
        id="email"
        label="Email"
        type="email"
        placeholder="kofi.asante@ridgeway.gh"
        withAsterisk
        disabled={isEdit}
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("email")}
      />
      <PasswordInput
        id="password"
        label="Password"
        placeholder={isEdit ? "New password" : "Temporary password"}
        withAsterisk={!isEdit}
        description={
          isEdit
            ? "Optional. Leave blank to keep the current password."
            : "This person will sign in on the field app."
        }
        classNames={INPUT_CLASSNAMES}
        {...form.getInputProps("password")}
      />
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Group
        justify="flex-end"
        gap="md"
        className="w-full flex-col pt-4 sm:flex-row"
      >
        <Button
          type="button"
          variant="subtle"
          onClick={() => router.push("/users")}
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
          Save field worker
        </Button>
      </Group>
    </form>
  );
};

export default AddFieldWorkerForm;
