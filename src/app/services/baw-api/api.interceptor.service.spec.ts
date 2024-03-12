import {
  HttpClient,
  HttpClientModule,
  HttpContext,
  HttpParams,
} from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { User } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { noop } from "rxjs";
import { generateUser } from "@test/fakes/User";
import { API_ROOT } from "@services/config/config.tokens";
import {
  ApiErrorDetails,
  BawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from "http-status";
import { BawSessionService } from "./baw-session.service";
import { shouldNotFail, shouldNotSucceed } from "./baw-api.service.spec";
import { CREDENTIALS_CONTEXT } from "./api.interceptor.service";

describe("BawApiInterceptor", () => {
  let apiRoot: string;
  let http: HttpClient;
  let spec: SpectatorHttp<BawSessionService>;
  const createService = createHttpFactory({
    service: BawSessionService,
    imports: [HttpClientModule, MockBawApiModule],
  });

  function getPath(path: string) {
    return apiRoot + path;
  }

  function setLoggedOut() {
    spyOnProperty(spec.service, "isLoggedIn", "get").and.returnValue(false);
    spyOnProperty(spec.service, "loggedInUser", "get").and.returnValue(
      undefined
    );
  }

  function setLoggedIn(authToken?: string) {
    spyOnProperty(spec.service, "isLoggedIn", "get").and.returnValue(true);
    spyOnProperty(spec.service, "authToken", "get").and.returnValue(authToken);
    spyOnProperty(spec.service, "loggedInUser", "get").and.returnValue(
      new User(generateUser())
    );
  }

  beforeEach(() => {
    spec = createService();
    http = spec.inject(HttpClient);
    apiRoot = spec.inject(API_ROOT);
  });

  describe("error handling", () => {
    function convertErrorResponseToDetails(
      response: BawApiError
    ): ApiErrorDetails {
      return {
        status: response.status,
        message: response.message,
        info: response.info as any,
      };
    }

    beforeEach(() => setLoggedOut());

    it("should handle api error response", () => {
      const error = generateBawApiError(
        NOT_FOUND,
        "The following action does not exist, if you believe this is an error please report a problem."
      );

      http.get(getPath("/brokenapiroute")).subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(error);
        },
      });

      spec
        .expectOne(getPath("/brokenapiroute"), HttpMethod.GET)
        .flush({}, { status: 404, statusText: "" });
    });

    xit("should handle api error response with info", () => {
      const error = generateBawApiError(UNPROCESSABLE_ENTITY, "", {
        name: ["has already been taken"],
      }) as any;

      http.get(getPath("/brokenapiroute")).subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(convertErrorResponseToDetails(error));
        },
      });

      spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET).flush(error, {
        status: error.meta.status,
        statusText: error.meta.message,
      });
    });

    xit("should handle http error response", () => {
      http.get(getPath("/brokenapiroute")).subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual({
            status: 404,
            message: `Http failure response for ${apiRoot}/brokenapiroute: 404 Page Not Found`,
          });
        },
      });

      spec
        .expectOne(getPath("/brokenapiroute"), HttpMethod.GET)
        .flush({}, { status: 404, statusText: "Page Not Found" });
    });
  });

  describe("non baw api traffic", () => {
    describe("outgoing data", () => {
      function makeRequest() {
        http.get("https://brokenlink").subscribe(noop);
        return spec.expectOne("https://brokenlink", HttpMethod.GET);
      }

      it("should not set Authorization header when not logged in", () => {
        setLoggedOut();
        const req = makeRequest();
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should not set Authorization header when logged in", () => {
        setLoggedIn();
        const req = makeRequest();
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should not convert into snake case for GET requests", () => {
        setLoggedOut();
        http
          .get("https://brokenlink/brokenapiroute", {
            params: new HttpParams().set("shouldNotConvert", "true"),
          })
          .subscribe(noop);
        expect(
          spec.expectOne(
            "https://brokenlink/brokenapiroute?shouldNotConvert=true",
            HttpMethod.GET
          )
        ).toBeInstanceOf(TestRequest);
      });

      it("should not convert into snake case for POST requests", () => {
        setLoggedOut();
        http
          .post("https://brokenlink/brokenapiroute", {
            shouldNotConvert: true,
          })
          .subscribe(noop);

        const req = spec.expectOne(
          "https://brokenlink/brokenapiroute",
          HttpMethod.POST
        );
        expect(req.request.body).toEqual({ shouldNotConvert: true });
      });
    });

    describe("incoming data", () => {
      beforeEach(() => setLoggedOut());

      it("should not convert into camel case for GET requests", () => {
        http.get("https://brokenlink/brokenapiroute").subscribe({
          next: (response) =>
            expect(response).toEqual({ dummy_response: true }),
          error: shouldNotFail,
        });
        spec
          .expectOne("https://brokenlink/brokenapiroute", HttpMethod.GET)
          .flush({ dummy_response: true });
      });

      it("should not convert into camel case for POST requests", () => {
        http.post("https://brokenlink/brokenapiroute", {}).subscribe({
          next: (response) =>
            expect(response).toEqual({ dummy_response: true }),
          error: shouldNotFail,
        });
        spec
          .expectOne("https://brokenlink/brokenapiroute", HttpMethod.POST)
          .flush({ dummy_response: true });
      });
    });
  });

  describe("baw api traffic", () => {
    describe("outgoing data", () => {
      it("should set cookies", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.withCredentials).toBeTrue();
      });

      it("should convert into snake case for GET requests", () => {
        setLoggedOut();
        http
          .get(getPath("/brokenapiroute"), {
            params: new HttpParams().set("shouldConvert", "true"),
          })
          .subscribe(noop);

        expect(
          spec.expectOne(
            getPath("/brokenapiroute?should_convert=true"),
            HttpMethod.GET
          )
        ).toBeInstanceOf(TestRequest);
      });

      it("should convert into snake case for POST requests", () => {
        setLoggedOut();
        http
          .post(getPath("/brokenapiroute"), { shouldConvert: true })
          .subscribe(noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.POST);
        expect(req.request.body).toEqual({ should_convert: true });
      });

      it("should not attach Authorization when unauthenticated", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should not attach Authorization when unauthenticated and the credentials context is explicitly set", () => {
        const mockContext = new HttpContext().set(CREDENTIALS_CONTEXT, true);
        setLoggedOut();

        http
          .get(getPath("/brokenapiroute"), {
            context: mockContext,
          })
          .subscribe(noop);

        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);

        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should attach Authorization when authenticated and the credentials context is not set", () => {
        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");
        http.get(getPath("/brokenapiroute")).subscribe(noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Authorization")).toBe(
          'Token token="xxxxxxxxxxxxxxxxxxxx"'
        );
      });

      it("should not attach Authorization when the credentials context has set to false", () => {
        const mockContext = new HttpContext().set(CREDENTIALS_CONTEXT, false);

        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");

        http
          .get(getPath("/brokenapiroute"), {
            context: mockContext,
          })
          .subscribe(noop);

        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);

        expect(req.request.headers.has("Authorization")).toBeFalse();
      });

      it("should attach Authorization when the credentials context is explicitly set to true", () => {
        const mockContext = new HttpContext().set(CREDENTIALS_CONTEXT, true);

        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");

        http
          .get(getPath("/brokenapiroute"), {
            context: mockContext,
          })
          .subscribe(noop);

        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);

        expect(req.request.headers.get("Authorization")).toBe(
          'Token token="xxxxxxxxxxxxxxxxxxxx"'
        );
      });

      it("should default to attaching Authorization when the credentials context is not set", () => {
        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");

        http.get(getPath("/brokenapiroute")).subscribe(noop);

        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);

        expect(req.request.headers.get("Authorization")).toBe(
          'Token token="xxxxxxxxxxxxxxxxxxxx"'
        );
      });
    });

    describe("incoming data", () => {
      beforeEach(() => setLoggedOut());

      it("should convert into camel case for GET requests", () => {
        http.get(getPath("/brokenapiroute")).subscribe({
          next: (response) => expect(response).toEqual({ dummyResponse: true }),
          error: shouldNotFail,
        });

        spec
          .expectOne(getPath("/brokenapiroute"), HttpMethod.GET)
          .flush({ dummy_response: true });
      });

      it("should convert incoming data from baw api into camel case for POST requests", () => {
        http.post(getPath("/brokenapiroute"), {}).subscribe({
          next: (response) => expect(response).toEqual({ dummyResponse: true }),
          error: shouldNotFail,
        });

        spec
          .expectOne(getPath("/brokenapiroute"), HttpMethod.POST)
          .flush({ dummy_response: true });
      });
    });
  });
});
