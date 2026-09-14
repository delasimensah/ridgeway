import "react-native-reanimated";
import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import {
  ActiveToast,
  AppProviders,
  BottomSheetsManager,
  ErrorToast,
  NeutralToast,
  SuccessToast,
} from "@/components";
import { FONT_LOADING_MAP } from "@/constants";
import { useApplyAvailableUpdate, useFieldSession } from "@/hooks";
import { defaultStackScreenOptions, screenPresets } from "@/utils";

cssInterop(Image, { className: "style" });
cssInterop(ImageBackground, { className: "style" });
cssInterop(LinearGradient, { className: "style" });

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const {
    isSessionLoading,
    isAuthenticated,
    isViewerReady,
    isField,
    isTenant,
    currentLease,
  } = useFieldSession();
  const isCheckingUpdate = useApplyAvailableUpdate();

  useEffect(() => {
    if (!isSessionLoading && !isCheckingUpdate) {
      void SplashScreen.hideAsync();
    }
  }, [isSessionLoading, isCheckingUpdate]);

  if (isSessionLoading || isCheckingUpdate) {
    return null;
  }

  const canEnterField = isAuthenticated && (isField || !isViewerReady);
  const canEnterTenant =
    isAuthenticated && isViewerReady && currentLease !== null;
  const canEnterEnded =
    isAuthenticated && isViewerReady && isTenant && currentLease === null;
  const canEnterNotAllowed =
    isAuthenticated && isViewerReady && !isField && !isTenant;

  return (
    <Stack
      screenOptions={{
        ...defaultStackScreenOptions,
        ...screenPresets.noHeader,
        animation: "none",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={canEnterField}>
        <Stack.Screen name="(main-app)" />
      </Stack.Protected>
      <Stack.Protected guard={canEnterTenant}>
        <Stack.Screen name="(tenant-app)" />
      </Stack.Protected>
      <Stack.Protected guard={canEnterEnded}>
        <Stack.Screen name="lease-ended" />
      </Stack.Protected>
      <Stack.Protected guard={canEnterNotAllowed}>
        <Stack.Screen name="not-allowed" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    ...FONT_LOADING_MAP,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <AppProviders>
          <BottomSheetModalProvider>
            <RootNavigator />
            <BottomSheetsManager />
            <Toast
              config={{
                active: (props) => <ActiveToast {...props} />,
                neutral: (props) => <NeutralToast {...props} />,
                success: (props) => <SuccessToast {...props} />,
                error: (props) => <ErrorToast {...props} />,
              }}
            />
          </BottomSheetModalProvider>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
