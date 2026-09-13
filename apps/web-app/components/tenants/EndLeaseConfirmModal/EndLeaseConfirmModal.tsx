"use client";

import { Button, Group, Modal, Stack, ThemeIcon } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import React from "react";

import { COLORS } from "@/constants";

import Text from "../../ui/Text/Text";

interface EndLeaseConfirmModalProps {
  opened: boolean;
  tenantName: string;
  unitLabel: string;
  buildingName: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const EndLeaseConfirmModal: React.FC<EndLeaseConfirmModalProps> = ({
  opened,
  tenantName,
  unitLabel,
  buildingName,
  onConfirm,
  onClose,
  isSubmitting = false,
  errorMessage = null,
}) => {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Are you sure you want to end this lease?"
      centered
      size="lg"
      radius={8}
      padding="xl"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      closeButtonProps={{ "aria-label": "Close" }}
      classNames={{
        title: "text-[18px] font-bold text-darkGrey sm:text-[20px]",
        content: "border border-border",
        body: "text-center",
      }}
    >
      <Stack align="center" gap="lg">
        <ThemeIcon
          size={64}
          radius="xl"
          variant="transparent"
          className="bg-sidebar"
        >
          <IconFileText size={24} color={COLORS.darkGrey} />
        </ThemeIcon>
        <Text className="max-w-[500px] text-[15px] text-grey sm:text-base">
          {`This will end ${tenantName}'s lease for Unit ${unitLabel} at ${buildingName} effective immediately. This action cannot be undone.`}
        </Text>
        {errorMessage !== null ? (
          <Text className="text-sm text-overdue">{errorMessage}</Text>
        ) : null}
        <Group justify="center" gap="md" wrap="wrap" className="w-full">
          <Button
            type="button"
            variant="subtle"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-auto w-full px-6 py-3 text-[15px] font-semibold text-grey hover:bg-transparent hover:text-darkGrey sm:w-auto sm:px-8"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loading={isSubmitting}
            data-autofocus
            className="h-auto w-full rounded-[8px] bg-danger px-8 py-3 text-[15px] font-semibold text-white hover:bg-dangerHover sm:w-auto sm:px-10"
          >
            End lease
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EndLeaseConfirmModal;
