import { DateTime, Duration, ToRelativeOptions } from "luxon";
import { isUninitialized } from "../helpers";

/**
 * BAW API ID
 */
export type Id = number;

/**
 * BAW API IDs
 */
export type Ids = Set<number>;

/**
 * BAW API UUID
 */
export type Uuid = string;
/**
 * BAW API Item Name
 */
export type Param = string;
/**
 * BAW API Username
 */
export type UserName = string;
/**
 * BAW API Authentication Token
 */
export type AuthToken = string;
/**
 * BAW API Item Description
 */
export type Description = string;
/**
 * BAW Notes
 */
export type Notes = Blob;
/**
 * Attempt to parse notes
 * @param blob Notes
 */
export function notes(blob: string): Blob {
  if (isUninitialized(blob)) {
    return undefined;
  }

  return new Blob([blob], { type: "text/plain" });
}
/**
 * BAW API DateTime
 */
export type DateTimeTimezone = DateTime;
/**
 * Convert timestamp string into DateTimeTimezone
 * @param timestamp Timestamp string
 */
export function dateTimeTimezone(timestamp: string): DateTimeTimezone {
  return timestamp ? DateTime.fromISO(timestamp, { setZone: true }) : undefined;
}
/**
 * Convert duration string into Duration
 * @param seconds Duration seconds
 */
export function duration(seconds: number): Duration {
  return seconds
    ? Duration.fromObject({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds
      }).normalize()
    : undefined;
}
/**
 * Humanize a durations length of time.
 * TODO Replace with luxon official solution
 * @param dur Duration
 */
export function humanizeDuration(
  dur: Duration,
  opts: ToRelativeOptions = {}
): string {
  let dateTime = DateTime.local();
  dateTime = dateTime.minus(dur);

  let output = dateTime.toRelative({ round: false, ...opts });
  output = output.replace("in ", "");
  output = output.replace(" ago", "");
  return output;
}
/**
 * BAW API Latitude
 */
export type Latitude = string;
/**
 * BAW API Longitude
 */
export type Longitude = string;
/**
 * BAW API Image Sizes
 */
export enum ImageSizes {
  extraLarge = "extralarge",
  large = "large",
  medium = "medium",
  small = "small",
  tiny = "tiny"
}
/**
 * BAW API Timezone Details
 */
export interface TimezoneInformation {
  friendlyIdentifier: string;
  identifier: string;
  identifierAlt: string;
  utcOffset: number;
  utcTotalOffset: number;
}
/**
 * BAW API Image Details
 */
export interface ImageURL {
  height: number;
  size: "extralarge" | "large" | "medium" | "small" | "tiny";
  url: string;
  width: number;
}
