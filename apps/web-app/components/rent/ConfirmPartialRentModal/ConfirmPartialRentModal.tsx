"use client";

import { Button, Group, Modal, NumberInput, Stack } from "@mantine/core";
import React, { useState } from "react";
import { type Currency, currencySymbol, formatMoney } from "shared";

import Text from "../../ui/Text/Text";

interface ConfirmPartialRentModalProps {
  opened: boolean;
  unitLabel: string;
  tenantName: string;
  amount: number;
  currency: Currency;
  initialConfirmedAmount: number | null;
  onConfirm: (confirmedAmount: number) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

const ConfirmPartialRentModal: React.FC<ConfirmPartialRentModalProps> = ({
  opened,
  unitLabel,
  tenantName,
  amount,
  currency,
  initialConfirmedAmount,
  onConfirm,
  onClose,
  isSubmitting = false,
}) => {
  const [value, setValue] = useState<string | number>(
    initialConfirmedAmount === null ? "" : initialConfirmedAmount / 100
  );
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleConfirm = () => {
    const major = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(major) || major <= 0) {
      setError("Enter how much you received.");
      return;
    }

    const received = Math.round(major * 100);
    if (received >= amount) {
      setError(
        `That is the full ${formatMoney(amount, currency)}. Mark it paid instead.`
      );
      return;
    }

    setError(null);
    onConfirm(received);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="How much did they pay?"
      centered
      size="md"
      radius={8}
      padding="xl"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      closeButtonProps={{ "aria-label": "Close" }}
      classNames={{
        title: "text-[18px] font-bold text-darkGrey sm:text-[20px]",
        content: "border border-border",
      }}
    >
      <Stack gap="lg">
        <Text className="text-[15px] text-grey">
          {`${tenantName} owes ${formatMoney(amount, currency)} on Unit ${unitLabel}. Record what you have actually received. The rest stays outstanding.`}
        </Text>
        <NumberInput
          label="Amount received"
          prefix={`${currencySymbol(currency)} `}
          thousandSeparator=","
          decimalScale={2}
          min={0}
          max={amount / 100}
          hideControls
          data-autofocus
          value={value}
          onChange={(next) => {
            setValue(next);
            setError(null);
          }}
          error={error}
          classNames={{
            label: "mb-2 text-[15px] font-semibold text-darkGrey",
            input:
              "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
          }}
        />
        <Group justify="flex-end" gap="md" wrap="wrap">
          <Button
            type="button"
            variant="subtle"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-auto px-6 py-3 text-[15px] font-semibold text-grey hover:bg-transparent hover:text-darkGrey"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            loading={isSubmitting}
            className="h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover"
          >
            Save partial payment
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmPartialRentModal;
