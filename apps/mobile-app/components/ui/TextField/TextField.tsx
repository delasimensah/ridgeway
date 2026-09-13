import React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "shared";

import { COLORS } from "@/constants";

import { VStack } from "../Stack/Stack";
import Text from "../Text/Text";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <VStack spacing="sm">
      <Text className="font-app-bold text-[14px] text-darkGrey">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={COLORS.grey}
        className={cn(
          "h-[44px] rounded-md border border-border bg-white px-3 text-[15px] text-darkGrey",
          className
        )}
        {...props}
      />
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
    </VStack>
  );
};

export default TextField;
