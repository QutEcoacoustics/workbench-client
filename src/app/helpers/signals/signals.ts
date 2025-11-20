import { isSignal, Signal } from "@angular/core";

/**
 * A type that can either be a direct value of type T or a Signal that
 * produces a value of type T.
 * This is useful for route guards and directives that want to work in static,
 * zone.js, and signal-based components/environments.
 */
export type SignalOr<T> = T | Signal<T>;

/**
 * Allows you to unwrap a value that may be a signal or a direct value.
 * This is useful for handling inputs that may be provided as either as a signal
 * or a direct value.
 */
export function unwrapPotentialSignal<T>(value: T | Signal<T>): T {
  if (isSignal(value)) {
    return value();
  }

  return value;
}
