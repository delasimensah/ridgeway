import React from "react";

import Button from "../../ui/Button/Button";
import { VStack } from "../../ui/Stack/Stack";
import Text from "../../ui/Text/Text";

interface LoadFailedProps {
  message: string;
  onRetry: () => void;
}

const LoadFailed: React.FC<LoadFailedProps> = ({ message, onRetry }) => {
  return (
    <VStack align="center" justify="center" className="flex-1 px-4 py-20">
      <Text className="mb-6 text-center font-app-medium text-grey">
        {message}
      </Text>
      <Button text="Try again" onPress={onRetry} />
    </VStack>
  );
};

export default LoadFailed;
