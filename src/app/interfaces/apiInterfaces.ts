import { DateTime } from "luxon";

export type Id = number;

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
 * Defaults to 1970-01-01T00:00:00.000
 */
export type DateTimeTimezone = DateTime;
/**
 * Default value for BAW API DateTime
 */
export const defaultDateTimeTimezone = DateTime.fromISO(
  "1970-01-01T00:00:00.000"
);
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
