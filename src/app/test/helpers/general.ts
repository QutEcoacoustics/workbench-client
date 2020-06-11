import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Subject } from "rxjs";

/**
 * Default step size for timeouts
 */
export const testStepInterval = 16;

/**
 * Create an observable which will return after a number of steps
 * @param subject Subject to update
 * @param callback Return value for subject
 * @param isError Call `subject.error()`
 * @param steps Number of interval steps to wait (default = 0)
 */
export function nStepObservable<T>(
  subject: Subject<T>,
  callback: () => T | ApiErrorDetails,
  isError: boolean = false,
  steps: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      isError
        ? subject.error(callback() as ApiErrorDetails)
        : subject.next(callback() as T);
      resolve();
    }, testStepInterval * steps);
  });
}
