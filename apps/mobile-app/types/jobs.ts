import type { WorkOrderStatus } from "shared";

export type JobListItem = {
  _id: string;
  title: string;
  status: WorkOrderStatus;
  unitLabel: string;
  buildingName: string;
  address: string;
  reportedAt: number;
};
