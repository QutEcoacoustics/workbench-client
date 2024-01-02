import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ApiShow } from "@baw-api/api-common";
import { unknownErrorCode } from "@baw-api/baw-api.service";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { API_ROOT } from "@services/config/config.tokens";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable()
export class WebsiteStatusService implements ApiShow<WebsiteStatus> {
  public constructor(
    private http: HttpClient,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  // if the server is fully down, we will not receive a response from the API
  // we can therefore not determine the status of the server and we should return "null"
  public show(): Observable<WebsiteStatus | null> {
    const endpoint = `${this.apiRoot}/status`;

    return this.http
      .get<WebsiteStatus>(endpoint, {
        headers: WebsiteStatusService.requestHeaders,
      })
      .pipe(
        map((response) => new WebsiteStatus(response)),
        catchError((err: BawApiError | Error) => {
          const bawError = isBawApiError(err)
            ? err
            : new BawApiError(unknownErrorCode, err.message);

          console.error("Error fetching API /status endpoint:", bawError.message);

          return throwError((): BawApiError => bawError);
        })
      );
  }

  // by making this a static field, we don't have to recreate the headers every time we make a request
  private static readonly requestHeaders = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: "application/json",
  });
}
