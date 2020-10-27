import { defer, Observable, Subject } from "rxjs";
import { finalize } from "rxjs/operators";

/**
 * An rxjs operator, this will invoke a callback upon the parent
 * observables subscription.
 */
export function prepare<T>(
  callback: () => void
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}

/**
 * An rxjs operator, this will update the inserted observable so that
 * it wil be true while the parent observable is loading, and false when
 * the parent observable completes.
 */
export function indicate<T>(
  indicator: Subject<boolean>
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => indicator.next(true)),
      finalize(() => indicator.next(false))
    );
}
