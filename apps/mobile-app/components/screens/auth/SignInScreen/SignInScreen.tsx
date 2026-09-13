import React from "react";

import SignInForm from "../../../auth/SignInForm/SignInForm";
import KeyboardFormView from "../../../ui/KeyboardFormView/KeyboardFormView";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

const SignInScreen: React.FC = () => {
  return (
    <KeyboardFormView>
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
    </KeyboardFormView>
  );
};

export default SignInScreen;
