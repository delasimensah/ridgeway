import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { COLORS } from "@/constants";

const ANDROID_TAB_INDICATOR = COLORS.lightGrey;

const tabScreenStyle = { backgroundColor: COLORS.sidebar };

/**
 * Field worker tabs. Android gets a solid Material bar; iOS uses system chrome.
 * https://docs.expo.dev/router/advanced/native-tabs/
 */
const TabsLayout = () => {
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
      <NativeTabs.Trigger name="jobs" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Jobs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="briefcase.fill" md="work" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account" contentStyle={tabScreenStyle}>
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
