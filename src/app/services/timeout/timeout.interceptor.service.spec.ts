import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import httpStatus from "http-status";
import { Observable, timer } from "rxjs";
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
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TimeoutInterceptor,
        multi: true,
      },
    ],
  });

  function setup(timeout: number) {
    spec = createService({
      providers: [{ provide: TIMEOUT_OPTIONS, useValue: { timeout } }],
    });
  }

  afterEach(() => {
    spec.controller.verify();
  });

  [
    { method: "get", type: HttpMethod.GET },
    { method: "post", type: HttpMethod.POST },
  ].forEach((test) => {
    let timeoutInterval: number;

    function callService(): Observable<any> {
      return spec.service[test.method]();
    }

    describe(`Intercept ${test.method} requests`, () => {
      beforeEach(() => {
        timeoutInterval = modelData.datatype.number({ min: 250, max: 500 });
        setup(timeoutInterval);
      });

      it("it should timeout a request after the timeout period", async () => {
        const response = callService()
          .toPromise()
          .catch((res) => res);
        spec.expectOne("/api/v1/getResources", test.type);

        await timer(timeoutInterval * 1.5).toPromise();
        expect(await response).toEqual({
          status: httpStatus.REQUEST_TIMEOUT,
          message:
            "Resource request took too long to complete. " +
            "This may be an issue with your connection to us, or a temporary issue with our services.",
        } as ApiErrorDetails);
      });

      it("it should not timeout a request if it returns before the timeout period", async () => {
        callService().subscribe();
        const req = spec.expectOne("/api/v1/getResources", test.type);
        await timer(timeoutInterval / 2).toPromise();
        req.flush(123);
      });
    });
  });
});
