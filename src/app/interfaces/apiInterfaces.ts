import humanizeDuration from "humanize-duration";
import { DateTime, Duration } from "luxon";

/**
 * BAW API ID
 */
export type Id = number;

/**
 * BAW API IDs
 */
export type Ids = Set<Id>;

/**
 * Union of Id and Ids
 */
export type CollectionIds = Ids | Id[];

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
 * BAW API Permission Levels
 */
export enum PermissionLevel {
  owner = "owner",
  writer = "writer",
  reader = "reader",
  unresolved = "unresolved",
  unknown = "unknown",
}

/**
 * Determines if the access level supplied passes the required access level
 *
 * @param requiredLevel The required access level, the current level must be
 * equal to or greater than this level
 * @param currentLevel The current access level
 */
export function hasRequiredAccessLevelOrHigher(
  requiredLevel: PermissionLevel,
  currentLevel: PermissionLevel
): boolean {
  const { owner, writer, reader, unresolved, unknown } = PermissionLevel;

  if (
    !unresolved ||
    !currentLevel ||
    unresolved === currentLevel ||
    unknown === currentLevel
  ) {
    return false;
  }

  const priority = [owner, writer, reader];
  const requiredIndex = priority.indexOf(requiredLevel);
  const currentIndex = priority.indexOf(currentLevel);
  return currentIndex <= requiredIndex;
}

/**
 * BAW API Item Description
 */
export type Description = string;

/**
 * BAW API Notes
 */
export type Hash = Record<string, any>;

/**
 * BAW API DateTime
 */
export type DateTimeTimezone = DateTime;

/**
 * Humanize a durations length of time.
 * TODO Replace with luxon official solution (https://github.com/moment/luxon/issues/688)
 *
 * @param dur Duration
 */
export function toRelative(
  dur: Duration,
  opts?: HumanizeDurationOptions
): string {
  return humanizeDuration(dur.as("milliseconds"), { delimiter: " ", ...opts });
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
  tiny = "tiny",
  default = "default",
  fallback = "fallback",
  unknown = "unknown",
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
  size: ImageSizes;
  url: string;
  height?: number;
  width?: number;
  default?: boolean;
}

/**
 * Evaluate if value is an ImageUrl
 *
 * @param value Value to evaluate
 */
export function isImageUrl(value: any): value is ImageUrl {
  if (!(value instanceof Object)) {
    return false;
  }

  const keys = Object.keys(value);
  const hasHeight = keys.includes("height");
  const hasWidth = keys.includes("width");

  let expectedKeys = 2;
  expectedKeys += hasHeight ? 1 : 0;
  expectedKeys += hasWidth ? 1 : 0;

  return (
    keys.length === expectedKeys &&
    keys.includes("size") &&
    keys.includes("url")
  );
}

export interface HasCreator {
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

export interface HasUpdater {
  updaterId?: Id;
  updatedAt?: DateTimeTimezone | string;
}

export interface HasDeleter {
  deleterId?: Id;
  deletedAt?: DateTimeTimezone | string;
}

export interface HasDescription {
  description?: Description;
  descriptionHtml?: Description;
  descriptionHtmlTagline?: Description;
}

export type HasAllUsers = HasCreator & HasUpdater & HasDeleter;
export type HasCreatorAndUpdater = HasCreator & HasUpdater;
export type HasCreatorAndDeleter = HasCreator & HasDeleter;

/**
 * Typescript definition for humanize-duration options. Full definition
 * and examples can be found here: https://github.com/EvanHahn/HumanizeDuration.js
 */
export interface HumanizeDurationOptions {
  /**
   * Language for unit display (accepts an ISO 639-1 code from one
   * of the supported languages).
   */
  language?: string;
  /**
   * Fallback languages if the provided language cannot be found
   * (accepts an ISO 639-1 code from one of the supported languages).
   * It works from left to right.
   */
  fallbacks?: string[];
  /** String to display between the previous unit and next value */
  delimiter?: string;
  /** String to display between each value and unit */
  spacer?: string;
  /**
   * Number representing the maximum number of units to display for the
   * duration
   */
  largest?: number;
  /**
   * Array of strings to define which units are used to display the
   * duration (if needed). Can be one, or a combination of any of the
   * following: `['y', 'mo', 'w', 'd', 'h', 'm', 's', 'ms']`
   */
  units?: ("y" | "mo" | "w" | "d" | "h" | "m" | "s" | "ms")[];
  /**
   * Boolean value. Use `true` to round the smallest unit displayed
   * (can be combined with `largest` and `units`).
   */
  round?: boolean;
  /** String to substitute for the decimal point in a decimal fraction. */
  decimal?: string;
  /**
   * String to include before the final unit. You can also set
   * `serialComma` to `false` to eliminate the final comma.
   */
  conjunction?: string;
  serialComma?: boolean;
  /** Number that defines a maximal decimal points for float values. */
  maxDecimalPoint?: number;
  /** Customize the value used to calculate each unit of time. */
  unitMeasures?: {
    y?: number;
    mo?: number;
    w?: number;
    d?: number;
    h?: number;
    m?: number;
    s?: number;
    ms?: number;
  };
}
