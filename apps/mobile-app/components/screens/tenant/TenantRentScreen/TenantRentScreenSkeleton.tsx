import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TenantRentInvoiceCardSkeleton from "../../../rent/TenantRentInvoiceCard/TenantRentInvoiceCardSkeleton";
import SkeletonCard from "../../../ui/SkeletonCard/SkeletonCard";
import { VStack } from "../../../ui/Stack/Stack";

const TenantRentScreenSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <VStack
      spacing="none"
      className="flex-1 bg-sidebar"
      style={{ paddingTop: insets.top + 8 }}
      accessible
      accessibilityLabel="Loading rent"
    >
      <VStack spacing="none" paddingX="md" className="pb-2 pt-3">
        <SkeletonCard width={72} height={28} radius={4} />
      </VStack>
      <VStack spacing="lg" paddingX="md" className="pb-8">
        <TenantRentInvoiceCardSkeleton />
        <TenantRentInvoiceCardSkeleton />
      </VStack>
    </VStack>
  );
};

export default TenantRentScreenSkeleton;
