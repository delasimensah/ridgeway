"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  handleAuthError,
  type SignInForm as SignInValues,
  signInSchema,
} from "shared";

import { demoSignInAccounts, isPublicDemo } from "@/utils";

import Text from "../../ui/Text/Text";

const DEMO_NOTE =
  "This is a demo. You can look through the office, an owner's buildings, and a tenant's home. Changes are not saved.";

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
  const demoAccounts = demoSignInAccounts({
    staffPassword: process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD,
    ownerPassword: process.env.NEXT_PUBLIC_DEMO_OWNER_PASSWORD,
    tenantPassword: process.env.NEXT_PUBLIC_DEMO_TENANT_PASSWORD,
  });
  const showDemo =
    isPublicDemo(process.env.NEXT_PUBLIC_DEMO_LOCK) &&
    demoAccounts.length === 3;

  const signInWithPassword = async (email: string, password: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      router.replace("/");
    } catch (caught) {
      setError(handleAuthError(caught).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: SignInValues) => {
    await signInWithPassword(values.email, values.password);
  };

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      {showDemo ? (
        <Box className="flex flex-col gap-3">
          <Text className="text-sm text-grey">{DEMO_NOTE}</Text>
          {demoAccounts.map((account) => (
            <Button
              key={account.email}
              type="button"
              variant="default"
              disabled={isSubmitting}
              onClick={() => {
                void signInWithPassword(account.email, account.password);
              }}
              className="h-auto whitespace-normal rounded-[8px] border-border py-3 text-base font-semibold text-darkGrey"
            >
              {account.label}
            </Button>
          ))}
        </Box>
      ) : null}
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
