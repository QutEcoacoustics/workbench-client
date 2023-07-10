import { DateTime, Duration } from "luxon";

export function queryStringArray(value: string): string[] {
  return value.split(",");
}

export function queryStringToNumberArray(value: string): number[] {
  return value.split(",").map(Number);
}

export function queryStringDateTimeArray(value: string): DateTime[] {
  return queryStringArray(value).map((date: string) =>
    date ? DateTime.fromISO(date, { zone: "utc" }) : undefined
  );
}

export function queryStringDurationTimeArray(value: string): Duration[] {
  return queryStringArray(value).map((duration: string) =>
    duration ? Duration.fromISOTime(duration) : undefined
  );
}

export function queryStringBoolean(value: string): boolean {
  return value === "true";
}

export function queryStringNumber(value: string): number {
  return Number(value);
}

// to QSP
export function dateTimeArrayToQueryString(value: DateTime[]): string {
  return value
    .map((date: DateTime) => (date ? date.toFormat("yyyy-MM-dd") : ""))
    .join(",");
}

export function durationArrayToQueryString(value: Duration[]): string {
  return value
    .map((duration: Duration) => (duration ? duration.toFormat("hh:mm") : ""))
    .join(",");
}
