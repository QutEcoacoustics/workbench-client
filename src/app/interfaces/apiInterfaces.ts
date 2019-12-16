/**
 * BAW API ID
 */
export type ID = number;
/**
 * BAW API List of IDs
 */
export type IDs = Set<ID>;
/**
 * BAW API UUID
 */
export type UUID = string;
/**
 * BAW API Item Name
 */
export type Name = string;
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
 * BAW API Item Time
 */
export type Time = Date;
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
