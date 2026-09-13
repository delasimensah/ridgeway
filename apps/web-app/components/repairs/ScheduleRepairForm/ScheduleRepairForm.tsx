"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import React, { useState } from "react";

import {
  getConvexErrorInfo,
  type ScheduleRepairFormValues,
  scheduleRepairSchema,
} from "@/utils";

import Text from "../../ui/Text/Text";

const DATE_PICKER_CLASSNAMES = {
  label: "mb-2 text-[13px] font-bold uppercase tracking-wider text-grey",
  input:
    "rounded-[8px] border-border bg-white py-3 pl-11 pr-10 text-base text-darkGrey focus:border-primary",
  placeholder: "text-grey",
};

const PRIMARY_BUTTON =
  "h-auto rounded-[8px] bg-primary px-6 py-2 text-[15px] font-semibold text-white hover:bg-primaryHover";

interface ScheduleRepairFormProps {
  workOrderId: Id<"workOrders">;
  initialValues?: ScheduleRepairFormValues;
}

const ScheduleRepairForm: React.FC<ScheduleRepairFormProps> = ({
  workOrderId,
  initialValues,
}) => {
  const schedule = useMutation(api.workOrders.schedule);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<ScheduleRepairFormValues>({
    initialValues: {
      scheduledFor: initialValues?.scheduledFor ?? "",
    },
    validate: zod4Resolver(scheduleRepairSchema),
  });

  const handleSubmit = async (values: ScheduleRepairFormValues) => {
    setError(null);
    setIsSaving(true);
    try {
      await schedule({
        workOrderId,
        scheduledFor: values.scheduledFor,
      });
    } catch (caught) {
      setError(getConvexErrorInfo(caught).message);
    } finally {
      setIsSaving(false);
    }
  };

  const { value, ...dateProps } = form.getInputProps("scheduledFor");

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <DatePickerInput
        id="scheduledFor"
        label="Visit date"
        placeholder="Pick a date"
        valueFormat="D MMM YYYY"
        highlightToday
        weekendDays={[]}
        withAsterisk
        pointer
        leftSection={<IconCalendar size={18} className="text-grey" />}
        className="min-w-[220px] flex-1"
        classNames={DATE_PICKER_CLASSNAMES}
        value={typeof value === "string" && value.length > 0 ? value : null}
        onChange={(next) => {
          form.setFieldValue("scheduledFor", next ?? "");
        }}
        error={dateProps.error}
      />
      {error !== null ? (
        <Text className="text-sm text-overdue">{error}</Text>
      ) : null}
      <Button
        type="submit"
        loading={isSaving}
        className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
      >
        Schedule
      </Button>
    </form>
  );
};

export default ScheduleRepairForm;
