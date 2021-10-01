import {
  HttpClient,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { Observable, TimeoutError, timer } from "rxjs";
import {
  TimeoutInterceptor,
  TIMEOUT_OPTIONS,
} from "./timeout.interceptor.service";

@Injectable()
class MockService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<any> {
    return this.httpClient.get("/api/v1/getResources");
  }

  public post(): Observable<any> {
    return this.httpClient.post("/api/v1/getResources", {
      params: { query: "123" },
    });
  }
}

describe("TimeoutInterceptor", () => {
  let spec: SpectatorHttp<MockService>;
  const createService = createHttpFactory({
    service: MockService,
    providers: [
      MockService,
      {
        provide: TIMEOUT_OPTIONS,
        useValue: { timeout: 1_000 },
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TimeoutInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => {
    spec = createService();
  });

  afterEach(() => {
    spec.controller.verify();
  });

  [
    { method: "get", type: HttpMethod.GET },
    { method: "post", type: HttpMethod.POST },
  ].forEach((test) => {
    function callService(): Observable<any> {
      return spec.service[test.method]();
    }

    it("it should timeout a request after the timeout period", async () => {
      const response = callService()
        .toPromise()
        .catch((res) => res);
      spec.expectOne("/api/v1/getResources", test.type);

      await timer(2_000).toPromise();
      expect(await response).toEqual(
        new HttpErrorResponse({
          error: jasmine.any(TimeoutError),
          url: "/api/v1/getResources",
        })
      );
    });

    it("it should not timeout a request if it returns before the timeout period", async () => {
      callService().subscribe();
      const req = spec.expectOne("/api/v1/getResources", test.type);
      await timer(100).toPromise();
      req.flush(123);
    });
  });
});
