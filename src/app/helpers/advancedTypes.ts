import { ApiErrorDetails } from "@baw-api/api.interceptor.service";

/**
 * Like Partial<T> but require certain properties.
 */
export type PartialWith<T, Keys extends keyof T = keyof T> = Pick<
  Partial<T>,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]: T[K];
  };

/**
 * Remove type options from another type
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Allow either type, but not both
 * TODO Add support for infinite number of types using variadic tuple types
 */
export type XOR<T, U> = T | U extends Record<string, any>
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * Response may be a promise, or may return in real time
 */
export type MayBeAsync<T> = T | Promise<T>;

/** Extract keys from a type which return a specific type */
export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

/** Sets type to either be T or null */
export type Option<T> = T | null;

/**
 * Shallowly removes typescript readonly flag from keys in type. This
 * does not remove javascript readonly enforcement
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/** Create a tuple (extends Array type and sets fixed length) */
export interface Tuple<T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
}

export type Errorable<T> = T | ApiErrorDetails;
