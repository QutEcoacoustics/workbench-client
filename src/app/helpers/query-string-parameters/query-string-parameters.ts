import { DateTime, Duration } from "luxon";

export function queryStringBoolean(value: string): boolean {
  return value === "true";
}

export function queryStringNumber(value: string): number {
  // we want to use number here so that if the user inputs a malformed number into the query string parameters
  // the condition is not applied, rather than returning incorrect results that would be returned with parseInt()
  return Number(value);
}

export function queryStringArray(value: string): string[] {
  return value.split(",").filter((item: string) => item);
}

export function queryStringToNumberArray(value: string): number[] {
  return queryStringArray(value).map(Number);
}

export function queryStringDateTimeArray(value: string): DateTime[] {
  return queryStringArray(value).map((date: string) =>
    DateTime.fromISO(date, { zone: "utc" })
  );
}

export function queryStringDurationTimeArray(value: string): Duration[] {
  return queryStringArray(value).map((duration: string) =>
    Duration.fromISOTime(duration)
  );
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
