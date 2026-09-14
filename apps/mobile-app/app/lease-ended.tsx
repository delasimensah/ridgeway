import { TenantLeaseEndedScreen } from "@/components";
import { useFieldSession } from "@/hooks";

const LeaseEndedRoute = () => {
  const { endedLease, handleSignOut, isSigningOut } = useFieldSession();

  return (
    <TenantLeaseEndedScreen
      unitLabel={endedLease?.unitLabel ?? ""}
      buildingName={endedLease?.buildingName ?? ""}
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
};

export default LeaseEndedRoute;
