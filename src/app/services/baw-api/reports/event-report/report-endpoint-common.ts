import { Injectable, inject } from "@angular/core";
import {
  ApiResponse,
  BawApiService,
  FilterAndOptionsOnly,
  FilterOptions,
  Filters,
} from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Observable, catchError, map, switchMap } from "rxjs";

@Injectable()
export abstract class ReportEndpointService {
  protected readonly api = inject<BawApiService<any>>(BawApiService);
  protected readonly session = inject(BawSessionService);

  protected post<TFilter, TResult>(
    path: string,
    filters: Filters<TFilter>,
    options?: FilterOptions,
  ): Observable<TResult[]> {
    const payload: FilterAndOptionsOnly<TFilter> = {
      filter: filters.filter,
    };

    const mergedOptions = {
      ...(filters.options ?? {}),
      ...(options ?? {}),
    };

    if (Object.keys(mergedOptions).length > 0) {
      payload.options = mergedOptions;
    }

    return this.session.authTriggerAfterInitialCheck.pipe(
      switchMap(() => this.api.httpPost(path, payload)),
      map((response: ApiResponse<TResult[]>) => response.data as TResult[]),
      catchError((error) => this.api.handleError(error)),
    );
  }
}
