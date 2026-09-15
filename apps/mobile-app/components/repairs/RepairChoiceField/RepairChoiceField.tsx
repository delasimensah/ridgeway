import { Pressable } from "react-native";
import { cn } from "shared";

import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface RepairChoiceOption<T extends string> {
  value: T;
  label: string;
}

interface RepairChoiceFieldProps<T extends string> {
  label: string;
  placeholder: string;
  value: T | "";
  options: RepairChoiceOption<T>[];
  open: boolean;
  error?: string;
  onOpen: () => void;
  onSelect: (value: T) => void;
}

function RepairChoiceField<T extends string>({
  label,
  placeholder,
  value,
  options,
  open,
  error,
  onOpen,
  onSelect,
}: RepairChoiceFieldProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <VStack spacing="sm">
      <Text className="font-app-bold text-[13px] uppercase tracking-wider text-grey">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onOpen}
        className="h-[52px] justify-center rounded-lg border border-border bg-white px-4"
      >
        <Text
          className={cn("text-base", selected ? "text-darkGrey" : "text-grey")}
        >
          {selected?.label ?? placeholder}
        </Text>
      </Pressable>
      {open
        ? options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => onSelect(option.value)}
              className={cn(
                "rounded-lg border p-4",
                option.value === value
                  ? "border-primary bg-sidebar"
                  : "border-border bg-white"
              )}
            >
              <Text className="font-app-medium text-base text-darkGrey">
                {option.label}
              </Text>
            </Pressable>
          ))
        : null}
      {error ? <Text className="text-sm text-overdue">{error}</Text> : null}
    </VStack>
  );
}

export default RepairChoiceField;
