import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";
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
  secureTextEntry,
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <VStack spacing="sm">
      <Text className="font-app-bold text-[14px] text-darkGrey">{label}</Text>
      <View className="relative justify-center">
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={COLORS.grey}
          secureTextEntry={isPassword && !passwordVisible}
          className={cn(
            "h-[44px] rounded-md border border-border bg-white px-3 text-[15px] text-darkGrey",
            isPassword && "pr-11",
            className
          )}
          {...props}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
            onPress={() => {
              setPasswordVisible((visible) => !visible);
            }}
            className="absolute right-0 h-[44px] w-11 items-center justify-center"
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color={COLORS.grey}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
    </VStack>
  );
};

export default TextField;
