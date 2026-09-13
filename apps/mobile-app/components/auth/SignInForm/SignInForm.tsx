import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  handleAuthError,
  type SignInForm as SignInValues,
  signInSchema,
} from "shared";

import Button from "../../ui/Button/Button";
import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";
import TextField from "../../ui/TextField/TextField";

const SignInForm: React.FC = () => {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn("password", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });
    } catch (caught) {
      setError(handleAuthError(caught).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing="md">
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            label="Email address"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
      <Button
        text="Sign in"
        fullWidth
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </VStack>
  );
};

export default SignInForm;
