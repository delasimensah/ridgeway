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
    </Stack>
  );
};

export default TenantAppLayout;
