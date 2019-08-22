export type ID = number;
export type IDs = Set<ID>;
export type Name = string;
export type UserName = string;
export type AuthToken = string;
export type Description = string;
export enum ImageSizes {
  extraLarge = "extralarge",
  large = "large",
  medium = "medium",
  small = "small"
}

export interface TimezoneInformation {
  friendlyIdentifier: string;
  identifier: string;
  identifierAlt: string;
  utcOffset: number;
  utcTotalOffset: number;
}
export interface ImageURL {
  height: number;
  size: "extralarge" | "large" | "medium" | "small";
  url: string;
  width: number;
}
