import { AccountScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const AccountRoute = () => {
  const { displayName, handleSignOut, isSigningOut } = useFieldSession();

  return (
    <AccountScreen
      displayName={displayName}
      roleLabel="Field worker"
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
};

export default AccountRoute;
