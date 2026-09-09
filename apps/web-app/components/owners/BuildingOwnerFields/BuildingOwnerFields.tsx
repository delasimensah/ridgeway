"use client";

import { Select, Stack } from "@mantine/core";
import React from "react";

import { NEW_OWNER_CHOICE } from "@/utils";

import Text from "../../ui/Text/Text";

export interface BuildingOwnerOption {
  _id: string;
  displayName: string;
}

interface BuildingOwnerFieldsProps {
  owners: BuildingOwnerOption[];
  ownerChoice: string;
  onOwnerChoice: (value: string) => void;
  ownerChoiceError?: React.ReactNode;
  children?: React.ReactNode;
}

const INPUT_CLASSNAMES = {
  label: "mb-2 text-[15px] font-semibold text-darkGrey",
  input:
    "rounded-[8px] border-border bg-white px-4 py-3 text-base text-darkGrey focus:border-primary",
};

const BuildingOwnerFields: React.FC<BuildingOwnerFieldsProps> = ({
  owners,
  ownerChoice,
  onOwnerChoice,
  ownerChoiceError,
  children,
}) => {
  const isNewOwner = ownerChoice === NEW_OWNER_CHOICE;

  return (
    <Stack gap="md">
      <Select
        id="ownerChoice"
        label="Owner"
        placeholder="No owner yet"
        data={[
          ...owners.map((owner) => ({
            value: owner._id,
            label: owner.displayName,
          })),
          { value: NEW_OWNER_CHOICE, label: "Add a new owner…" },
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
        value={ownerChoice.length === 0 ? null : ownerChoice}
        error={ownerChoiceError}
        onChange={(value) => {
          onOwnerChoice(value ?? "");
        }}
      />
      {isNewOwner ? <Stack gap="md">{children}</Stack> : null}
      <Text className="rounded-[8px] border border-border bg-sidebar p-4 text-sm leading-relaxed text-grey">
        This person will see only buildings linked to them.
      </Text>
    </Stack>
  );
};

export default BuildingOwnerFields;
