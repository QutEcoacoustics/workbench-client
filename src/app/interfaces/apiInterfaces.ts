import humanizeDuration from "humanize-duration";
import { DateTime, Duration } from "luxon";

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
 * BAW API DateTime
 */
export type DateTimeTimezone = DateTime;

/**
 * Humanize a durations length of time.
 * TODO Replace with luxon official solution
 * @param dur Duration
 */
export function toRelative(dur: Duration, opts?: any): string {
  return humanizeDuration(dur.as("milliseconds"), opts);
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
  EXTRA_LARGE = "extralarge",
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
  TINY = "tiny",
  DEFAULT = "default",
  UNKNOWN = "unknown",
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
export interface ImageUrl {
  size:
    | "extralarge"
    | "large"
    | "medium"
    | "small"
    | "tiny"
    | "default"
    | "unknown";
  url: string;
  height?: number;
  width?: number;
}
