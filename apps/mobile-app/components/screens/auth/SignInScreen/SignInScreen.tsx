import React from "react";

import SignInForm from "../../../auth/SignInForm/SignInForm";
import BrandMark from "../../../ui/BrandMark/BrandMark";
import KeyboardFormView from "../../../ui/KeyboardFormView/KeyboardFormView";
import { VStack } from "../../../ui/Stack/Stack";
import Text from "../../../ui/Text/Text";

const SignInScreen: React.FC = () => {
  return (
    <KeyboardFormView>
      <VStack spacing="xl" className="w-full">
        <BrandMark size="page" showWordmark={false} className="self-center" />
        <SignInForm />
        <Text className="text-center text-[14px] text-grey">
          Tenants and field staff use this app.
        </Text>
      </VStack>
    </KeyboardFormView>
  );
};

export default SignInScreen;
