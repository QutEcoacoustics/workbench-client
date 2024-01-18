import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BawApiService, unknownErrorCode } from "@baw-api/baw-api.service";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { IWebsiteStatus, WebsiteStatus } from "@models/WebsiteStatus";
import {
  Observable,
  catchError,
  defer,
  distinct,
  interval,
  map,
  shareReplay,
  startWith,
  switchMap,
  throwError,
} from "rxjs";

@Injectable()
export class WebsiteStatusService {
  public constructor(private api: BawApiService<WebsiteStatus>) {
    this.status$ = this.tick$.pipe(
      switchMap(() => this.show()),
      distinct(),
      shareReplay(1)
    );
  }

  public status$: Observable<WebsiteStatus>;
  private tick$ = defer(() => interval(30_000).pipe(startWith(-1)));

  // by making this a service level field, we don't have to recreate the headers every time we make a request
  private readonly requestHeaders = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: "application/json",
  });

  // if the server is fully down, we will not receive a response from the API
  // we can therefore not determine the status of the server and we should return "null"
  private show(): Observable<WebsiteStatus | null> {
    const endpoint = "/status";

    // we use our custom api.httpGet so that this service using our site wide
    // caching config (and can be overwritten by the caller in a uniform manner)
    return (this.api.httpGet(endpoint, this.requestHeaders) as any).pipe(
      map((response: IWebsiteStatus) => new WebsiteStatus(response)),
      catchError((err: BawApiError | Error) => {
        const bawError = isBawApiError(err)
          ? err
          : new BawApiError(unknownErrorCode, err.message);

        console.error("Error fetching API /status endpoint:", bawError.message);

        return throwError((): BawApiError => bawError);
      })
    );
  }
}
