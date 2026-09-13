import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const JobStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="update-status" options={{ presentation: "modal" }} />
      <Stack.Screen name="completion-photo" />
    </Stack>
  );
};

export default JobStackLayout;
