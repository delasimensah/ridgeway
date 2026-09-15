import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const HomeStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default HomeStackLayout;
