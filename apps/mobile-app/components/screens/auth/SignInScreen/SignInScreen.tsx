import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SignInForm from "../../../auth/SignInForm/SignInForm";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

const SignInScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <VStack
        spacing="lg"
        paddingX="lg"
        align="center"
        justify="center"
        className="flex-1 bg-white"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <VStack spacing="lg" className="w-full">
          <Text className="text-center font-app-black text-[32px] tracking-tight text-darkGrey">
            Ridgeway
          </Text>
          <VStack spacing="sm">
            <Text className="text-center font-app-black text-2xl text-darkGrey">
              Sign in
            </Text>
            <Text className="text-center text-[14px] text-grey">
              Tenants and field staff use this app.
            </Text>
          </VStack>
          <SignInForm />
        </VStack>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
