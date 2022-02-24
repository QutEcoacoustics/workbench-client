import { Pipe, PipeTransform } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { catchError, map, Observable, of, startWith } from "rxjs";

export interface LoadingResult<T> {
  loading: boolean;
  error?: ApiErrorDetails;
  value?: T;
}

@Pipe({ name: "withLoading" })
export class WithLoadingPipe implements PipeTransform {
  public transform<T>(obj: Observable<T>): Observable<LoadingResult<T>> {
    return obj.pipe(
      map((value): LoadingResult<T> => ({ loading: false, value })),
      startWith({ loading: true }),
      catchError(
        (error: ApiErrorDetails): Observable<LoadingResult<T>> =>
          of({ loading: false, error })
      )
    );
  }
}
