"use client";

import { NumberInput, SimpleGrid } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import React from "react";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
  description: "mt-1 text-sm text-grey",
};

export function rentDueDayDescription(rentDueDay: string): string {
  const day = Number(rentDueDay.trim());
  if (
    rentDueDay.trim().length === 0 ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 31
  ) {
    return "Rent falls due on this day every month.";
  }
  return `For example, September rent is due ${day} Sep.`;
}

interface LeaseRentFieldsProps<
  T extends { rentAmount?: string; rentDueDay?: string },
> {
  form: UseFormReturnType<T>;
}

function LeaseRentFields<
  T extends { rentAmount?: string; rentDueDay?: string },
>({ form }: LeaseRentFieldsProps<T>) {
  const rentAmount = form.values.rentAmount ?? "";
  const rentDueDay = form.values.rentDueDay ?? "";

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
      <NumberInput
        id="rentAmount"
        label="Rent (GH₵)"
        placeholder="4500"
        description="Monthly amount for this lease."
        min={0}
        decimalScale={2}
        hideControls
        classNames={INPUT_CLASSNAMES}
        value={rentAmount.length === 0 ? "" : Number(rentAmount)}
        error={form.errors.rentAmount}
        onChange={(value) => {
          form.setFieldValue(
            "rentAmount" as never,
            (value === "" || value === undefined ? "" : String(value)) as never
          );
        }}
      />
      <NumberInput
        id="rentDueDay"
        label="Due each month on"
        placeholder="5"
        description={rentDueDayDescription(rentDueDay)}
        min={1}
        max={31}
        allowDecimal={false}
        hideControls
        classNames={INPUT_CLASSNAMES}
        value={rentDueDay.length === 0 ? "" : Number(rentDueDay)}
        error={form.errors.rentDueDay}
        onChange={(value) => {
          form.setFieldValue(
            "rentDueDay" as never,
            (value === "" || value === undefined ? "" : String(value)) as never
          );
        }}
      />
    </SimpleGrid>
  );
}

export default LeaseRentFields;
