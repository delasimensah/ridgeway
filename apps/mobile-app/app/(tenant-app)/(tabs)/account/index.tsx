import { AccountScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const TenantAccountRoute = () => {
  const { displayName, handleSignOut, isSigningOut } = useFieldSession();

  return (
    <AccountScreen
      displayName={displayName}
      roleLabel="Tenant"
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
};

export default TenantAccountRoute;
