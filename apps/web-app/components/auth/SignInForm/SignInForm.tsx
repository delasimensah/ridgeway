"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  handleAuthError,
  type SignInForm as SignInValues,
  signInSchema,
} from "shared";

import Text from "../../ui/Text/Text";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zod4Resolver(signInSchema),
  });

  const handleSubmit = async (values: SignInValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn("password", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });
      router.replace("/");
    } catch (caught) {
      setError(handleAuthError(caught).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        id="email"
        label="Email address"
        placeholder="jamie@example.com"
        type="email"
        autoComplete="email"
        withAsterisk
        classNames={{
          label: "mb-2 text-[15px] font-semibold text-darkGrey",
          input:
            "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
        }}
        {...form.getInputProps("email")}
      />
      <PasswordInput
        id="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        withAsterisk
        classNames={{
          label: "mb-2 text-[15px] font-semibold text-darkGrey",
          input:
            "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
        }}
        {...form.getInputProps("password")}
      />
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Button
        type="submit"
        loading={isSubmitting}
        className="h-auto rounded-[8px] bg-primary py-3 text-base font-semibold text-white hover:bg-primaryHover"
      >
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
