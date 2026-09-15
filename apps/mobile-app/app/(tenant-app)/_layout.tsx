import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const TenantAppLayout = () => {
  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="file-repair" />
      <Stack.Screen name="repair/[workOrderId]" />
    </Stack>
  );
};

export default TenantAppLayout;
