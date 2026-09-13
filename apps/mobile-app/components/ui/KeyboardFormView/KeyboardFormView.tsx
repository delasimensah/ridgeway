import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { cn } from "shared";

import { useAppInsets } from "@/hooks";

interface KeyboardFormViewProps {
  children: React.ReactNode;
  className?: string;
  contentJustify?: "center" | "flex-start";
}

const KeyboardFormView: React.FC<KeyboardFormViewProps> = ({
  children,
  className,
  contentJustify = "center",
}) => {
  const insets = useAppInsets();

  return (
    <KeyboardAvoidingView
      className={cn("flex-1 bg-white", className)}
      behavior="padding"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: contentJustify,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardFormView;
