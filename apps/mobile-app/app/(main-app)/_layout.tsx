import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const MainAppLayout = () => {
  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job/[workOrderId]" />
    </Stack>
  );
};

export default MainAppLayout;
