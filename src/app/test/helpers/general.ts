import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { AbstractModel } from "@models/AbstractModel";
import { Subject } from "rxjs";

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
