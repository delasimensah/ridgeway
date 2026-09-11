"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  Alert,
  Button,
  Group,
  PasswordInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, type UseFormReturnType } from "@mantine/form";
import { IconAlertCircle, IconCalendar } from "@tabler/icons-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  type AddTenantFormValues,
  addTenantSchema,
  getConvexErrorInfo,
  isExistingTenantChoice,
  NEW_TENANT_CHOICE,
  utcToday,
} from "@/utils";

import Text from "../../ui/Text/Text";

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-8 py-3 text-[15px] font-semibold text-white hover:bg-primaryHover";

const SAVE_ERROR =
  "Could not save this tenant. Check the fields and try again.";

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
  form: UseFormReturnType<AddTenantFormValues>,
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

const FIELD_BY_MESSAGE: Record<string, keyof AddTenantFormValues> = {
  "Lease start must be today or earlier": "startedOn",
  "Lease end cannot be before the start date": "endedOn",
  "This unit already has a current lease": "unitId",
  "Enter a valid email": "email",
  "That email already belongs to someone on staff": "email",
  "That email already belongs to someone else": "email",
  "That email already belongs to someone who can sign in": "email",
  "This person already has a current lease": "email",
  "This tenant already has a login": "password",
  "This tenant does not have a login yet": "password",
  "Password must be at least 8 characters long": "password",
};

export interface TenantUnitOption {
  _id: string;
  label: string;
}

interface AddTenantFormProps {
  buildingId: Id<"buildings">;
  units: TenantUnitOption[];
  leaseId?: Id<"leases">;
  lockUnit?: boolean;
  initialValues?: AddTenantFormValues;
  hasLogin?: boolean;
}

const AddTenantForm: React.FC<AddTenantFormProps> = ({
  buildingId,
  units,
  leaseId,
  lockUnit = false,
  initialValues,
  hasLogin = false,
}) => {
  const router = useRouter();
  const isEditing = leaseId !== undefined;
  const availableTenants = useQuery(
    api.leases.listAvailableForStaff,
    isEditing ? "skip" : {}
  );
  const createLease = useMutation(api.leases.createWithTenant);
  const createForExisting = useMutation(api.leases.createForExistingTenant);
  const updateTenant = useMutation(api.leases.updateTenant);
  const grantLogin = useAction(api.leases.grantLogin);
  const setPassword = useAction(api.leases.setPassword);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buildingHref = `/buildings/${buildingId}`;
  const selectedUnit = units.find(
    (unit) => unit._id === (initialValues?.unitId ?? "")
  );
  const latestStart = utcToday();

  const form = useForm<AddTenantFormValues>({
    initialValues: {
      unitId: units.length === 1 ? units[0]._id : "",
      tenantChoice: NEW_TENANT_CHOICE,
      displayName: "",
      phone: "",
      email: "",
      startedOn: "",
      endedOn: "",
      password: "",
      ...initialValues,
    },
    validate: zod4Resolver(addTenantSchema),
  });

  const handleSubmit = async (values: AddTenantFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const shouldGrantLogin =
        !hasLogin &&
        !isExistingTenantChoice(values.tenantChoice) &&
        values.password.length > 0;
      const shouldSetPassword = hasLogin && values.password.length > 0;

      if (shouldGrantLogin) {
        await grantLogin({
          ...(leaseId !== undefined
            ? { leaseId }
            : { unitId: values.unitId as Id<"units"> }),
          displayName: values.displayName,
          email: values.email,
          phone: values.phone,
          startedOn: values.startedOn,
          endedOn: values.endedOn,
          password: values.password,
        });
      } else if (leaseId !== undefined) {
        await updateTenant({
          leaseId,
          displayName: values.displayName,
          email: values.email,
          phone: values.phone,
          startedOn: values.startedOn,
          endedOn: values.endedOn,
        });
        if (shouldSetPassword) {
          await setPassword({
            leaseId,
            password: values.password,
          });
        }
      } else if (isExistingTenantChoice(values.tenantChoice)) {
        await createForExisting({
          unitId: values.unitId as Id<"units">,
          tenantProfileId: values.tenantChoice as Id<"profiles">,
          startedOn: values.startedOn,
          endedOn: values.endedOn,
        });
      } else {
        await createLease({
          unitId: values.unitId as Id<"units">,
          displayName: values.displayName,
          email: values.email,
          phone: values.phone,
          startedOn: values.startedOn,
          endedOn: values.endedOn,
        });
      }
      router.replace(buildingHref);
    } catch (caught) {
      const info = getConvexErrorInfo(caught);
      const field = FIELD_BY_MESSAGE[info.message];
      if (field !== undefined) {
        form.setFieldError(field, info.message);
      } else if (
        info.code === "NOT_PERMITTED" ||
        info.message === "NOT_PERMITTED"
      ) {
        setError(SAVE_ERROR);
      } else {
        setError(info.message.length > 0 ? info.message : SAVE_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.onSubmit(handleSubmit)}>
      {lockUnit ? (
        <TextInput
          id="unit"
          label="Unit"
          value={selectedUnit?.label ?? ""}
          readOnly
          classNames={{
            ...INPUT_CLASSNAMES,
            input: `${INPUT_CLASSNAMES.input} bg-sidebar`,
          }}
        />
      ) : (
        <Select
          id="unit"
          label="Unit"
          placeholder="Pick a unit"
          data={units.map((unit) => ({
            value: unit._id,
            label: unit.label,
          }))}
          allowDeselect={false}
          withAsterisk
          pointer
          comboboxProps={{ shadow: "sm" }}
          classNames={{
            label: INPUT_CLASSNAMES.label,
            input: INPUT_CLASSNAMES.input,
            dropdown: "rounded-[8px] border border-border bg-white",
            option:
              "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
          }}
          {...form.getInputProps("unitId")}
        />
      )}
      {isEditing ? null : (
        <Select
          id="tenantChoice"
          label="Tenant"
          placeholder="Pick a tenant"
          data={[
            ...(availableTenants ?? []).map((tenant) => ({
              value: tenant._id,
              label: tenant.displayName,
            })),
            { value: NEW_TENANT_CHOICE, label: "Add a tenant…" },
          ]}
          allowDeselect={false}
          withAsterisk
          pointer
          comboboxProps={{ shadow: "sm", withinPortal: false }}
          classNames={{
            label: INPUT_CLASSNAMES.label,
            input: INPUT_CLASSNAMES.input,
            dropdown: "rounded-[8px] border border-border bg-white",
            option:
              "rounded-[6px] text-[15px] text-darkGrey bg-white hover:bg-sidebar data-[combobox-selected]:bg-sidebar data-[combobox-active]:bg-sidebar",
          }}
          {...form.getInputProps("tenantChoice")}
        />
      )}
      {isEditing || !isExistingTenantChoice(form.values.tenantChoice) ? (
        <>
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
          <PasswordInput
            id="password"
            label="Password"
            placeholder={hasLogin ? "New password" : "Temporary password"}
            description={
              hasLogin
                ? "Optional. Leave blank to keep the current password."
                : "Optional. Set one to give this person a website login."
            }
            classNames={INPUT_CLASSNAMES}
            {...form.getInputProps("password")}
          />
          <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
            {hasLogin
              ? "This person can already sign in. They can file a repair on their current unit."
              : "Set a password to let this person sign in and file a repair on their current unit."}
          </Text>
        </>
      ) : null}
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
      {error ? (
        <Alert
          color="red"
          title="Could not save"
          icon={<IconAlertCircle />}
          className="rounded-[8px]"
        >
          {error}
        </Alert>
      ) : null}
      <Group
        justify="flex-end"
        gap="md"
        className="w-full flex-col pt-6 sm:flex-row"
      >
        <Button
          type="button"
          variant="subtle"
          onClick={() => router.push(buildingHref)}
          className="h-auto w-full px-6 py-3 text-[15px] font-semibold text-grey hover:text-darkGrey sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
        >
          Save tenant
        </Button>
      </Group>
    </form>
  );
};

export default AddTenantForm;
