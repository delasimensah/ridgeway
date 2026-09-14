"use client";

import { Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import React from "react";

import {
  type AddUnitFormValues,
  isExistingTenantChoice,
  NEW_TENANT_CHOICE,
  utcToday,
} from "@/utils";

import Text from "../../ui/Text/Text";
import LeaseRentFields from "../LeaseRentFields/LeaseRentFields";

export interface AvailableTenantOption {
  _id: string;
  displayName: string;
}

interface UnitTenantFieldsProps {
  form: UseFormReturnType<AddUnitFormValues>;
  tenants?: AvailableTenantOption[];
}

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const DATE_PICKER_CLASSNAMES = {
  label: INPUT_CLASSNAMES.label,
  input:
    "rounded-[8px] border-border bg-white py-3 pl-11 pr-10 text-base text-darkGrey focus:border-primary",
  placeholder: "text-grey",
  datePickerRoot:
    "[--mantine-primary-color-filled:theme(colors.primary)] [--mantine-primary-color-filled-hover:theme(colors.primaryHover)] [--mantine-primary-color-contrast:theme(colors.white)] [--mantine-primary-color-light:theme(colors.sidebar)]",
  calendarHeaderLevel: "font-semibold text-darkGrey hover:bg-sidebar",
  calendarHeaderControl: "text-darkGrey hover:bg-sidebar",
  weekday: "text-grey",
  day: "text-darkGrey hover:bg-sidebar data-[selected]:bg-primary data-[selected]:text-white data-[selected]:hover:bg-primaryHover data-[today]:border-primary",
  monthsListControl:
    "text-darkGrey hover:bg-sidebar data-[selected]:bg-primary data-[selected]:text-white",
  yearsListControl:
    "text-darkGrey hover:bg-sidebar data-[selected]:bg-primary data-[selected]:text-white",
};

const DATE_PICKER_POPOVER = {
  shadow: "sm" as const,
  classNames: {
    dropdown: "rounded-[8px] border border-border bg-white",
  },
};

const DATE_PICKER_ICON = <IconCalendar size={18} className="text-grey" />;

function datePickerProps(
  form: UseFormReturnType<AddUnitFormValues>,
  field: "startedOn" | "endedOn"
) {
  const { value, ...rest } = form.getInputProps(field);
  return {
    ...rest,
    value: typeof value === "string" && value.length > 0 ? value : null,
    onChange: (next: string | null) => {
      form.setFieldValue(field, next ?? "");
    },
  };
}

const UnitTenantFields: React.FC<UnitTenantFieldsProps> = ({
  form,
  tenants = [],
}) => {
  const tenantChoice = form.values.tenantChoice ?? "";
  const isNewTenant = tenantChoice === NEW_TENANT_CHOICE;
  const isExistingTenant = isExistingTenantChoice(tenantChoice);
  const showLeaseDates = isNewTenant || isExistingTenant;
  const latestStart = utcToday();

  return (
    <Stack gap="md">
      <Select
        id="tenantChoice"
        label="Tenant"
        placeholder="No tenant yet"
        data={[
          ...tenants.map((tenant) => ({
            value: tenant._id,
            label: tenant.displayName,
          })),
          { value: NEW_TENANT_CHOICE, label: "Add a tenant…" },
        ]}
        clearable
        pointer
        comboboxProps={{ shadow: "sm", withinPortal: false }}
        classNames={{
          label: INPUT_CLASSNAMES.label,
          input: INPUT_CLASSNAMES.input,
          dropdown: "rounded-[8px] border border-border bg-white",
          option:
            "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
        }}
        value={tenantChoice.length === 0 ? null : tenantChoice}
        error={form.errors.tenantChoice}
        onChange={(value) => {
          form.setFieldValue("tenantChoice", value ?? "");
        }}
      />
      {isNewTenant ? (
        <Stack gap="md">
          <TextInput
            id="displayName"
            label="Name"
            placeholder="Sofia Herrera"
            withAsterisk
            classNames={INPUT_CLASSNAMES}
            {...form.getInputProps("displayName")}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            <TextInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="024 XXX XXXX"
              classNames={INPUT_CLASSNAMES}
              {...form.getInputProps("phone")}
            />
            <TextInput
              id="email"
              label="Email"
              type="email"
              placeholder="sofia.herrera@example.com"
              withAsterisk
              classNames={INPUT_CLASSNAMES}
              {...form.getInputProps("email")}
            />
          </SimpleGrid>
        </Stack>
      ) : null}
      {showLeaseDates ? (
        <>
          <LeaseRentFields form={form} />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            <DatePickerInput
              id="startedOn"
              label="Lease start"
              placeholder="Pick a date"
              valueFormat="D MMM YYYY"
              maxDate={latestStart}
              highlightToday
              weekendDays={[]}
              withAsterisk
              pointer
              leftSection={DATE_PICKER_ICON}
              popoverProps={DATE_PICKER_POPOVER}
              classNames={DATE_PICKER_CLASSNAMES}
              {...datePickerProps(form, "startedOn")}
            />
            <DatePickerInput
              id="endedOn"
              label="Lease end"
              placeholder="Pick a date"
              valueFormat="D MMM YYYY"
              minDate={form.values.startedOn || undefined}
              clearable
              highlightToday
              weekendDays={[]}
              pointer
              leftSection={DATE_PICKER_ICON}
              popoverProps={DATE_PICKER_POPOVER}
              classNames={DATE_PICKER_CLASSNAMES}
              {...datePickerProps(form, "endedOn")}
            />
          </SimpleGrid>
        </>
      ) : null}
      <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
        Leave this empty if the unit is vacant. Pick someone who already rented,
        or add a new tenant.
      </Text>
    </Stack>
  );
};

export default UnitTenantFields;
