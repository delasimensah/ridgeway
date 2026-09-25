import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { COLORS } from "@/constants";

/** Soft Material indicator — not a full primary blob. */
const ANDROID_TAB_INDICATOR = COLORS.lightGrey;

const tabScreenStyle = { backgroundColor: COLORS.sidebar };

/**
 * Native tabs. Android: solid white bar, labeled icons, warm indicator.
 * iOS: system chrome (may be liquid glass on newer OS). Same layout both.
 * https://docs.expo.dev/router/advanced/native-tabs/
 */
const TenantTabsLayout = () => {
  return (
    <NativeTabs
      tintColor={COLORS.primary}
      backgroundColor={Platform.OS === "android" ? COLORS.white : undefined}
      labelVisibilityMode="labeled"
      disableTransparentOnScrollEdge
      tabBarRespectsIMEInsets
      indicatorColor={
        Platform.OS === "android" ? ANDROID_TAB_INDICATOR : undefined
      }
      iconColor={{
        default: COLORS.grey,
        selected: COLORS.primary,
      }}
      rippleColor={COLORS.lightGrey}
      labelStyle={{
        fontSize: 11,
        fontFamily: "Template-Medium",
      }}
    >
      <NativeTabs.Trigger name="home" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="repairs" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Repairs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wrench.and.screwdriver.fill" md="build" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="rent" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Rent</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="doc.text.fill" md="receipt" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TenantTabsLayout;
