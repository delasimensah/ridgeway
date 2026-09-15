import { type Href, Redirect } from "expo-router";

import { RoleWaitScreen } from "@/components";
import { useFieldSession } from "@/hooks";
import { signedInDestination } from "@/utils";

const IndexRoute = () => {
  const { isAuthenticated, isViewerReady, isField, isTenant, currentLease } =
    useFieldSession();

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/sign-in" as Href} />;
  }

  const href = signedInDestination({
    isAuthenticated,
    isViewerReady,
    isField,
    isTenant,
    currentLease,
  });

  if (href === null) {
    return <RoleWaitScreen />;
  }

  return <Redirect href={href as Href} />;
};

export default IndexRoute;
