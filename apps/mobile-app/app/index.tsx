import { type Href, Redirect } from "expo-router";

import { useFieldSession } from "@/hooks";

const IndexRoute = () => {
  const { isAuthenticated, isViewerReady, isField, isTenant, currentLease } =
    useFieldSession();

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
  }

  if (isViewerReady && isField) {
    return <Redirect href={"/(main-app)/(tabs)/jobs" as Href} />;
  }

  if (isViewerReady && currentLease !== null) {
    return <Redirect href={"/(tenant-app)/(tabs)/home" as Href} />;
  }

  if (isViewerReady && isTenant) {
    return <Redirect href={"/lease-ended" as Href} />;
  }

  if (isViewerReady) {
    return <Redirect href={"/not-allowed" as Href} />;
  }

  return <Redirect href={"/(main-app)/(tabs)/jobs" as Href} />;
};

export default IndexRoute;
