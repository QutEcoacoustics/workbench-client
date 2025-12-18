import { BawApiError } from "@helpers/custom-errors/baw-api-error";

/**
 * Like Partial<T> but require certain properties.
 */
export type PartialWith<T, Keys extends keyof T = keyof T> = Pick<
  Partial<T>,
  Exclude<keyof T, Keys>
> & {
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
export interface MonoTuple<T, L extends number> extends Array<T> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  0: T;
  length: L;
}

/** Indicates an object can either be that object, or an error response */
export type Errorable<T> = T | BawApiError;

/** Like Partial, but recursively looks down the entire object */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

/** This value may be asynchronous */
export type PotentiallyAsync<T> = T | Promise<T>;

export type SortFunction<T, U = T> = (a: T, b: U) => -1 | 0 | 1;

// this brand symbol should never be used at runtime
// it is only used to have a type that cannot be instantiated by TypeScript
// outside of the Brand function
const brandSymbol = Symbol("brand");

/**
 * @summary
 * a brand is a way of creating a type-alias that isn't compatible with its
 * base type
 * this is done by adding a symbol property key to the TypeScript type that only
 * exists at compile time
 *
 * This can be used to create a discriminated union of two types at compile time
 * that are otherwise identical at runtime
 *
 * @example
 * ```ts
 * type Pixel = Brand<number, "PxUnit">;
 * type EmUnit = Brand<number, "EmUnit">;
 *
 * const width: Pixel = 10;
 * const height: EmUnit = 10;
 *
 * // this will throw a type error
 * const total = width + height;
 * ```
 */
export type Brand<T, BrandName extends string> = T & {
  [key in typeof brandSymbol]: BrandName;
};

export function withBrand<BrandedType extends Brand<unknown, string>>(
  value: unknown,
): BrandedType {
  return value as BrandedType;
}

export type Constructor<T> = new (...args: any[]) => T;
