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
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * Response may be a promise, or may return in real time
 */
export type MayBeAsync<T> = T | Promise<T>;
