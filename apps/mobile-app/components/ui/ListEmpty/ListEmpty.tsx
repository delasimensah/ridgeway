import React from "react";

import Button from "../Button/Button";
import { VStack } from "../Stack/Stack";
import Text from "../Text/Text";

interface ListEmptyProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Inline empty copy for list screens (not a full-page empty route). */
const ListEmpty: React.FC<ListEmptyProps> = ({
  message,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <VStack
      spacing="md"
      align="center"
      justify="center"
      className={className ?? "py-10"}
    >
      <Text className="text-center text-base text-grey">{message}</Text>
      {actionLabel && onAction ? (
        <Button
          text={actionLabel}
          variant="outline"
          size="sm"
          onPress={onAction}
          accessibilityLabel={actionLabel}
        />
      ) : null}
    </VStack>
  );
};

export default ListEmpty;
