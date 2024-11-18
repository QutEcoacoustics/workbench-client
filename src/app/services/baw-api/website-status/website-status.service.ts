import { HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BawApiService, unknownErrorCode } from "@baw-api/baw-api.service";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import {
  IWebsiteStatus,
  ServerTimeout,
  SsrContext,
  WebsiteStatus,
} from "@models/WebsiteStatus";
import { disableCache } from "@services/cache/ngHttpCachingConfig";
import {
  Observable,
  catchError,
  defer,
  interval,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  throwError,
} from "rxjs";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

@Injectable()
export class WebsiteStatusService {
  public constructor(
    private api: BawApiService<WebsiteStatus>,
    @Inject(IS_SERVER_PLATFORM) private isSsr: boolean
  ) {
    if (this.isSsr) {
      this.status$ = of(SsrContext.instance);
    } else {
      // we only create the tick$ singleton client side so that we don't make
      // continuous requests on the SSR server for the status
      this.tick$ = defer(() => interval(30_000).pipe(startWith(-1)));

      this.status$ = this.tick$.pipe(
        switchMap(() =>
          this.show().pipe(catchError(() => of(ServerTimeout.instance)))
        ),
        shareReplay(1)
      );
    }
  }

  public status$: Observable<WebsiteStatus>;
  private tick$: Observable<number>;

  // by making this a service level field, we don't have to recreate the headers every time we make a request
  private readonly requestHeaders = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: "application/json",
  });

  // if the server is fully down, we will not receive a response from the API
  // we can therefore not determine the status of the server and we should return "null"
  private show(): Observable<WebsiteStatus | null> {
    const endpoint = "/status";

    return (
      this.api.httpGet(endpoint, this.requestHeaders, {
        cacheOptions: { isCacheable: disableCache },
        withCredentials: false,
      }) as any
    ).pipe(
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
