import { AbstractModel } from "@models/AbstractModel";
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
  /*
    Extra object fields required, do not remove. Duration calculates itself
    based on the time spans provided, if years is removed for example,
    the output will just keep incrementing months (i.e 24 months, instead of 2 years).
  */
  return seconds
    ? Duration.fromObject({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds,
      }).normalize() // Normalize seconds into other keys (i.e 200 seconds => 3 minutes, 20 seconds)
    : undefined;
}

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
  extraLarge = "extralarge",
  large = "large",
  medium = "medium",
  small = "small",
  tiny = "tiny",
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

/**
 * Convert a collection of ids into a set
 */
export const BawCollection = createDecorator((model, key, ids: Id[]) => {
  model[key] = new Set(ids || []);
});

/**
 * Convert timestamp string into DateTimeTimezone
 */
export const BawDateTime = createDecorator((model, key, timestamp: string) => {
  model[key] = timestamp
    ? DateTime.fromISO(timestamp, { setZone: true })
    : null;
});

/**
 * Convert duration string into Duration
 */
export const BawDuration = createDecorator((model, key, seconds: number) => {
  /*
    Extra object fields required, do not remove. Duration calculates itself
    based on the time spans provided, if years is removed for example,
    the output will just keep incrementing months (i.e 24 months, instead of 2 years).
  */
  model[key] = seconds
    ? Duration.fromObject({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds,
      }).normalize() // Normalize seconds into other keys (i.e 200 seconds => 3 minutes, 20 seconds)
    : null;
});

/**
 * Abstract code required for baw decorators
 * @param setter Function to run on construction
 */
function createDecorator(
  setter: (model: AbstractModel, key: symbol, ...args: any[]) => void
) {
  return (model: AbstractModel, key: string) => {
    const symbolKey = Symbol("_" + key);

    Object.defineProperty(model, key, {
      get() {
        return model[symbolKey];
      },
      set(...args: any[]) {
        setter(model, symbolKey, ...args);
        // TODO Remove setter after change
      },
    });
  };
}
