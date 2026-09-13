import { format } from "date-fns";

export function formatJobsHeadingDate(now: Date = new Date()): string {
  return format(now, "EEEE, d MMM");
}
