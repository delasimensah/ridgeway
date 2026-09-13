import { type Href, Redirect } from "expo-router";

import { useFieldSession } from "@/hooks";

const IndexRoute = () => {
  const { isAuthenticated, isViewerReady, isField } = useFieldSession();

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
  }

  if (isViewerReady && !isField) {
    return <Redirect href={"/not-allowed" as Href} />;
  }

  return <Redirect href={"/(main-app)/(tabs)/jobs" as Href} />;
};

export default IndexRoute;
