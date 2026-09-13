"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Anchor, Box, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { type AddTenantFormValues, getConvexErrorInfo } from "@/utils";

import AddTenantForm, {
  type TenantUnitOption,
} from "../../tenants/AddTenantForm/AddTenantForm";
import EndLeaseConfirmModal from "../../tenants/EndLeaseConfirmModal/EndLeaseConfirmModal";
import Heading from "../../ui/Heading/Heading";
import Text from "../../ui/Text/Text";

interface AddTenantPageProps {
  buildingId: Id<"buildings">;
  buildingName: string;
  units: TenantUnitOption[];
  unitLabel?: string;
  leaseId?: Id<"leases">;
  lockUnit?: boolean;
  initialValues?: AddTenantFormValues;
  hasLogin?: boolean;
  returnHref?: string;
}

const AddTenantPage: React.FC<AddTenantPageProps> = ({
  buildingId,
  buildingName,
  units,
  unitLabel,
  leaseId,
  lockUnit,
  initialValues,
  hasLogin,
  returnHref,
}) => {
  const router = useRouter();
  const endLease = useMutation(api.leases.end);
  const [opened, { open, close }] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fromTenantsList = returnHref === "/tenants";
  const backHref = fromTenantsList ? "/tenants" : `/buildings/${buildingId}`;
  const backLabel = fromTenantsList ? "Tenants" : buildingName;
  const placeLabel = fromTenantsList
    ? [buildingName, unitLabel].filter(Boolean).join(" · ")
    : unitLabel;
  const endedOn = initialValues?.endedOn?.trim() ?? "";
  const canEndLease =
    leaseId !== undefined &&
    (endedOn.length === 0 || endedOn >= new Date().toISOString().slice(0, 10));
  const doneHref = returnHref ?? `/buildings/${buildingId}`;

  const handleConfirm = async () => {
    if (leaseId === undefined) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await endLease({ leaseId });
      close();
      router.replace(doneHref);
    } catch (caught) {
      const info = getConvexErrorInfo(caught);
      setErrorMessage(
        info.message.length > 0 ? info.message : "Could not end this lease."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="max-w-[800px]">
      <Box className="mb-8 sm:mb-10">
        <Group gap={8} className="mb-2 text-[14px] font-medium">
          <Anchor
            component={Link}
            href={backHref}
            underline="never"
            className="text-grey hover:text-darkGrey"
          >
            {backLabel}
          </Anchor>
          {placeLabel ? (
            <Text component="span" className="text-grey">
              /
            </Text>
          ) : null}
          {placeLabel ? (
            <Text component="span" className="text-grey">
              {placeLabel}
            </Text>
          ) : null}
        </Group>
        <Heading
          variant="page"
          className="mb-0 text-[24px] font-bold text-darkGrey sm:text-[28px] md:text-[32px]"
        >
          {leaseId === undefined ? "Add tenant" : "Edit tenant"}
        </Heading>
      </Box>
      <Box className="rounded-[8px] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AddTenantForm
          buildingId={buildingId}
          units={units}
          leaseId={leaseId}
          lockUnit={lockUnit}
          initialValues={initialValues}
          hasLogin={hasLogin}
          returnHref={returnHref ?? `/buildings/${buildingId}`}
        />
      </Box>
      {canEndLease ? (
        <Box className="mt-6">
          <Button
            type="button"
            variant="subtle"
            onClick={open}
            className="h-auto px-0 text-[15px] font-semibold text-danger hover:bg-transparent hover:text-dangerHover"
          >
            End lease
          </Button>
        </Box>
      ) : null}
      <EndLeaseConfirmModal
        opened={opened}
        tenantName={initialValues?.displayName ?? ""}
        unitLabel={unitLabel ?? ""}
        buildingName={buildingName}
        onConfirm={() => {
          void handleConfirm();
        }}
        onClose={close}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default AddTenantPage;
