import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { AbstractModel } from "@models/AbstractModel";
import { Subject } from "rxjs";

/**
 * An object which keeps track of the various breakpoints set for the
 * viewport in karma.conf.js. This can be used in conjunction with
 * `viewport.set()` to change the size of the browser during unit tests
 */
export const viewports = {
  /** Bootstrap xs (w:575, h:480) */
  extraSmall: "extra-small",
  extraSmallDimensions: { width: 575, height: 480 },
  /** Bootstrap s (w:767, h:720) */
  small: "small",
  smallDimensions: { width: 767, height: 720 },
  /** Bootstrap m (w:991, h:1024) */
  medium: "medium",
  mediumDimensions: { width: 991, height: 1024 },
  /** Bootstrap l (w:1199, h:1300) */
  large: "large",
  largeDimensions: { width: 1199, height: 1300 },
  /** Bootstrap xl (w:1200, h:1500) */
  extraLarge: "extra-large",
  extraLargeDimensions: { width: 1200, height: 1500 },
};

/**
 * Default step size for timeouts
 */
export const testStepInterval = 0;

/**
 * Create an observable which will return after a number of steps
 *
 * @param subject Subject to update
 * @param callback Return value for subject
 * @param isError Call `subject.error()`
 * @param stepsRemaining Number of interval steps to wait (default = 0)
 */
export function nStepObservable<T>(
  subject: Subject<T>,
  callback: () => T | ApiErrorDetails,
  isError: boolean = false,
  stepsRemaining: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    function waitOne() {
      setTimeout(() => {
        if (stepsRemaining) {
          stepsRemaining--;
          return waitOne();
        }

        if (isError) {
          subject.error(callback() as ApiErrorDetails);
        } else {
          subject.next(callback() as T);
        }

        resolve();
      }, testStepInterval);
    }

    waitOne();
  });
}

export function interceptApiRequests<
  T,
  M extends AbstractModel | AbstractModel[]
>(
  apiRequestType: any,
  responses: (M | ApiErrorDetails)[],
  expectations?: FilterExpectations<T>[]
): Promise<void>[] {
  const subjects: Subject<M>[] = [];
  const promises: Promise<void>[] = [];

  responses.forEach((response) => {
    const subject = new Subject<M>();
    subjects.push(subject);
    promises.push(
      nStepObservable(subject, () => response, !(response instanceof Array))
    );
  });

  let count = -1;
  apiRequestType.andCallFake((filters: Filters<T>, ...params: any[]) => {
    count++;
    expectations?.[count]?.(filters, ...params);
    return subjects[count];
  });

  return promises;
}

export type FilterExpectations<T> = (
  filter: Filters<T>,
  ...params: any[]
) => void;

export function getCallArgs(spy: jasmine.Spy) {
  return spy.calls.mostRecent().args;
}

export function assertOk(): void {
  expect(true).toBeTrue();
}
