import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const RepairsStackLayout = () => {
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

export default RepairsStackLayout;
