import { Stack } from "expo-router";

import { COLORS } from "@/constants";

const AuthLayout = () => {
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="sign-in" />
    </Stack>
  );
};

export default AuthLayout;
