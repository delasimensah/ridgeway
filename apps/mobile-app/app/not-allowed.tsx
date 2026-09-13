import { NotAllowedScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const NotAllowedRoute = () => {
  const { handleSignOut, isSigningOut } = useFieldSession();

  return (
    <NotAllowedScreen
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
};

export default NotAllowedRoute;
