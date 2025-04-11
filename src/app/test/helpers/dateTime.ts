import { toRelative } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";

// throughout the client, we format durations and date/times in a humanized format
// eg. "6 years 2 months ago"
// to ensure that we have uniformity in formats, we should use this helper function
export function humanizedDuration(value: Duration | DateTime): string {
  const durationSince = value instanceof DateTime ? value.diffNow().rescale() : value;

  return toRelative(durationSince, {
    largest: 2,
    round: true,
  });
}
