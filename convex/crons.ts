import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "charge rent for the new month",
  "0 0 1 * *",
  internal.rent.chargeMonth,
  {}
);

export default crons;
