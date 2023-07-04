import { DateTime, Duration } from "luxon";

export function queryStringArray(value: string): string[] {
  return value.split(",");
}

export function queryStringToNumberArray(value: string): number[] {
  return value.split(",").map(Number);
}

export function queryStringDateTimeArray(value: string): DateTime[] {
  return queryStringArray(value).map(
    (date: string) => DateTime.fromISO(date, { zone: "utc" })
  );
}

export function queryStringDurationTimeArray(value: string): Duration[] {
  return queryStringArray(value).map(
    (duration: string) => Duration.fromISOTime(duration)
  );
}

export function queryStringBoolean(value: string): boolean {
  return value === "true";
}

export function queryStringNumber(value: string): number {
  return Number(value);
}
