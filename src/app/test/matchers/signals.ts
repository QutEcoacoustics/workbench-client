import { Signal, WritableSignal } from "@angular/core";
import { matcherFailure, matcherSuccess } from ".";

import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;

function isSignalWritable<T>(value: Signal<T>): value is WritableSignal<T> {
  const hasSetFunction = typeof value["set"] === "function";
  return hasSetFunction;
}

const toBeWriteableSignal = <T>(): CustomMatcher => ({
  negativeCompare: (value: Signal<T>) => {
    return isSignalWritable(value)
      ? matcherFailure("Expected signal to be readonly")
      : matcherSuccess();
  },
  compare: (value: Signal<T>) => {
    return isSignalWritable(value)
      ? matcherSuccess()
      : matcherFailure("Expected signal to be writable");
  },
});

export const signalMatchers = {
  toBeWriteableSignal,
} as const satisfies CustomMatcherFactories;
