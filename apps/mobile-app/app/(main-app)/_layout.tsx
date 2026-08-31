import { Stack } from "expo-router";

const MainAppLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" },
      }}
    />
  );
};

export default MainAppLayout;
