"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import React, { FormEvent, useState } from "react";

import { Text } from "@/components";

const SignInPage = () => {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", "signIn");

    try {
      await signIn("password", formData);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Could not sign in.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex min-h-screen items-center justify-center bg-black p-16">
      <Box className="w-full max-w-sm">
        <Text className="mb-2 text-3xl font-bold text-white">Sign in</Text>
        <Text className="mb-8 text-grey">Ridgeway staff, owners, and tenants.</Text>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
          />
          <PasswordInput
            name="password"
            label="Password"
            required
            autoComplete="current-password"
          />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
          <Button type="submit" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignInPage;
