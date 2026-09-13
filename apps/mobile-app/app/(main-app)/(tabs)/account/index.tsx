import { AccountScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const AccountRoute = () => {
  const { displayName, handleSignOut, isSigningOut } = useFieldSession();

  return (
    <AccountScreen
      displayName={displayName}
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
};

export default AccountRoute;
