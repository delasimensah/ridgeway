import type { Currency, RentConfirmedStatus, RentStatus } from "../types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function calendarDateUtc(serverNow: number): string {
  return new Date(serverNow).toISOString().slice(0, 10);
}

export function getRentDisplayStatus(
  period: { confirmedStatus: RentConfirmedStatus; dueOn: string },
  serverNow: number
): RentStatus {
  if (
    period.confirmedStatus === "paid" ||
    period.confirmedStatus === "partial"
  ) {
    return period.confirmedStatus;
  }
  const today = calendarDateUtc(serverNow);
  if (period.dueOn < today) {
    return "late";
  }
  return "due";
}

export function currencySymbol(currency: Currency): string {
  return currency === "GHS" ? "GH₵" : "US$";
}

export function formatMoney(amount: number, currency: Currency): string {
  const major = amount / 100;
  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: Number.isInteger(major) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(major);
  return `${currencySymbol(currency)} ${formatted}`;
}

/** Whole cedis or dollars → pesewas or cents. GH₵ 4,500 → 450000. */
export function toSmallestUnit(major: number): number {
  return Math.round(major * 100);
}

/** Pesewas or cents → whole cedis or dollars for form display. */
export function fromSmallestUnit(amount: number): number {
  return amount / 100;
}

export function formatPeriodLabel(periodLabel: string): string {
  const year = periodLabel.slice(0, 4);
  const month = Number(periodLabel.slice(5, 7));
  const monthName = MONTH_NAMES[month - 1];
  if (monthName === undefined) {
    return periodLabel;
  }
  return `${monthName} ${year}`;
}

export function rentStatusLabel(status: RentStatus): string {
  if (status === "paid") {
    return "Paid";
  }
  if (status === "partial") {
    return "Partial";
  }
  if (status === "due") {
    return "Due";
  }
  return "Late";
}
