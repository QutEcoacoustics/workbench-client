import {
  createHttpFactory,
  HttpMethod,
  mockProvider,
  SpectatorHttp,
} from "@ngneat/spectator";
import {
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { firstValueFrom, of } from "rxjs";
import { TransferState } from "@angular/core";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { RehydrationInterceptorService } from "./rehydration.interceptor.service";

interface StateTransferTest {
  method: HttpMethod;
  transferState: boolean;
  url?: string;
}

type MockResponseHandler<T = unknown> = (
  request: HttpRequest<T>
) => HttpResponse<unknown>;

describe("RehydrationInterceptorService", () => {
  let spec: SpectatorHttp<RehydrationInterceptorService>;
  let transferStateSpy: jasmine.SpyObj<TransferState>;
  let mockTransferedState: any;

  const createService = createHttpFactory({
    service: RehydrationInterceptorService,
    providers: [mockProvider(TransferState)],
  });

  function setup(isSsr: boolean): void {
    spec = createService({
      providers: [{ provide: IS_SERVER_PLATFORM, useValue: isSsr }],
    });

    transferStateSpy = spec.inject(TransferState);
    transferStateSpy.set.and.callThrough();
    transferStateSpy.get.and.callFake(() => mockTransferedState);
  }

  async function interceptorResponse<T>(
    request: HttpRequest<T>,
    mockResponse?: MockResponseHandler<T>
  )  {
    const handler: HttpHandler = {
      handle: (req: HttpRequest<T>) => {
        if (mockResponse) {
          return of(mockResponse(req));
        }

        // if we haven't specified a response in the function call, we'll just
        // return an empty response
        return of(new HttpResponse<unknown>());
      },
    };

    const value$ = spec.service.intercept(request, handler);
    return await firstValueFrom(value$);
  }

  it("should create", () => {
    setup(false);
    expect(spec.service).toBeInstanceOf(RehydrationInterceptorService);
  });

  describe("state transfer", () => {
    const defaultTestedUrl = "/projects/1";

    const tests = [
      { method: HttpMethod.GET, transferState: true },
      // although most POST requests won't transfer their state, we want
      // filter requests to transfer their state to the browser
      {
        method: HttpMethod.POST,
        transferState: true,
        url: defaultTestedUrl + "/filter",
      },

      { method: HttpMethod.POST, transferState: false },
      { method: HttpMethod.PUT, transferState: false },
      { method: HttpMethod.DELETE, transferState: false },
      { method: HttpMethod.HEAD, transferState: false },
      { method: HttpMethod.OPTIONS, transferState: false },
    ] satisfies StateTransferTest[];

    for (const isSsr of [false, true]) {
      describe(`isSsr: ${isSsr}`, () => {
        beforeEach(() => {
          setup(isSsr);
        });

        for (const test of tests) {
          // we only want to transfer state to the client if we are running in
          // an ssr environment
          const shouldTransferState = test.transferState && isSsr;

          // Prettier wants to put the interpolated variable on to a seperate line
          // because it goes past 80 characeters. This makes the test name use three
          // lines. By disabling prettier we can keep the test name on one line
          // making the test name easier to read.
          // prettier-ignore
          it(`should${shouldTransferState ? " not" : ""} transfer state`, async () => {
            const testedUrl = test.url ?? defaultTestedUrl;
            const body = { foo: "bar" };
            const request = new HttpRequest(test.method, testedUrl, body);

            await interceptorResponse(request);

            const expectedSetCallCount = shouldTransferState ? 1 : 0;
            expect(transferStateSpy.set).toHaveBeenCalledTimes(expectedSetCallCount);
          });
        }
      });
    }
  });

  describe("browser requests", () => {
    beforeEach(() => {
      setup(false);
    });

    it("should passthrough the request if it wasn't transfered from the server", async () => {
      const testedUrl = "/projects/1";
      const request = new HttpRequest("GET", testedUrl);

      const assertionHandler: MockResponseHandler = (req) => {
        expect(req.url).toEqual("/projects/1");
        return new HttpResponse();
      };

      await interceptorResponse(request, assertionHandler);

      expect(transferStateSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should use the servers response if passed from the server", async () => {
      const testedUrl = "/projects/1";
      const request = new HttpRequest("GET", testedUrl);

      const transferedResponse = new HttpResponse({
        body: { foo: "bar" },
        status: 200,
        statusText: "OK",
        headers: new HttpHeaders(),
      });

      mockTransferedState = transferedResponse;

      const response = await interceptorResponse(request);
      if (!(response instanceof HttpResponse)) {
        fail("Response was not returned");
        return;
      }

      expect(response.body).toEqual({ foo: "bar" });
      expect(response.status).toEqual(200);

      // when receive a response from the server during rehydration, we suffix
      // the status text with " (from server)"
      expect(response.statusText).toEqual("OK (from server)");
    });
  });

  describe("server requests", () => {
    beforeEach(() => {
      setup(true);
    });

    it("should pass-through cookies", async () => {
      const headers: HttpHeaders = new HttpHeaders().set("Cookie", "foo=bar");
      const request = new HttpRequest("GET", "/projects/1", { headers });

      const assertionHandler: MockResponseHandler = (req) => {
        expect(req.headers.get("Cookie")).toBe("foo=bar");
        return new HttpResponse();
      };

      await interceptorResponse(request, assertionHandler);
    });
  });
});
