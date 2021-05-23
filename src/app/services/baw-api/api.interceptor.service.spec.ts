/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { SessionUser } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { generateApiErrorResponse } from "@test/fakes/ApiErrorDetails";
import { generateSessionUser } from "@test/fakes/User";
import { noop } from "rxjs";
import { ApiResponse } from "./baw-api.service";
import { shouldNotFail, shouldNotSucceed } from "./baw-api.service.spec";

describe("BawApiInterceptor", () => {
  let apiRoot: string;
  let http: HttpClient;
  let spec: SpectatorHttp<SecurityService>;
  const createService = createHttpFactory({
    service: SecurityService,
    imports: [HttpClientModule, MockBawApiModule],
  });

  function getPath(path: string) {
    return apiRoot + path;
  }

  function setLoggedOut() {
    spyOn(spec.service, "isLoggedIn").and.callFake(() => false);
    spyOn(spec.service, "getLocalUser").and.callFake(() => undefined);
  }

  function setLoggedIn(authToken?: string) {
    spyOn(spec.service, "isLoggedIn").and.callFake(() => true);
    spyOn(spec.service, "getLocalUser").and.callFake(() =>
      authToken
        ? new SessionUser({ ...generateSessionUser(), authToken })
        : new SessionUser(generateSessionUser())
    );
  }

  beforeEach(() => {
    spec = createService();
    http = spec.inject(HttpClient);
    apiRoot = spec.inject(API_ROOT);
  });

  describe("error handling", () => {
    function convertErrorResponseToDetails(
      response: ApiResponse<null>
    ): ApiErrorDetails {
      return {
        status: response.meta.status,
        message: response.meta.error.details,
        info: response.meta.error.info,
      };
    }

    beforeEach(() => setLoggedOut());

    it("should handle api error response", () => {
      const error = generateApiErrorResponse("Unauthorized", {
        message: "Incorrect user name",
      });

      http
        .get(getPath("/brokenapiroute"))
        .subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual(convertErrorResponseToDetails(error));
        });

      spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET).flush(error, {
        status: error.meta.status,
        statusText: error.meta.message,
      });
    });

    it("should handle api error response with info", () => {
      const error = generateApiErrorResponse("Unprocessable Entity", {
        info: { name: ["has already been taken"] },
      });

      http
        .get(getPath("/brokenapiroute"))
        .subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual(convertErrorResponseToDetails(error));
        });

      spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET).flush(error, {
        status: error.meta.status,
        statusText: error.meta.message,
      });
    });

    it("should handle http error response", () => {
      http
        .get(getPath("/brokenapiroute"))
        .subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual({
            status: 404,
            message: `Http failure response for ${apiRoot}/brokenapiroute: 404 Page Not Found`,
          });
        });

      spec
        .expectOne(getPath("/brokenapiroute"), HttpMethod.GET)
        .flush({}, { status: 404, statusText: "Page Not Found" });
    });
  });

  describe("non baw api traffic", () => {
    describe("outgoing data", () => {
      function makeRequest() {
        http.get("https://brokenlink").subscribe(noop, noop);
        return spec.expectOne("https://brokenlink", HttpMethod.GET);
      }

      it("should not set accept header", () => {
        setLoggedOut();
        const req = makeRequest();
        expect(req.request.headers.has("Accept")).toBeFalsy();
      });

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

      it("should not set content-type header", () => {
        setLoggedOut();
        const req = makeRequest();
        expect(req.request.headers.has("Content-Type")).toBeFalsy();
      });

      it("should not convert into snake case for GET requests", () => {
        setLoggedOut();
        http
          .get("https://brokenlink/brokenapiroute", {
            params: new HttpParams().set("shouldNotConvert", "true"),
          })
          .subscribe(noop, noop);
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
          .subscribe(noop, noop);

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
        http
          .get("https://brokenlink/brokenapiroute")
          .subscribe(
            (response) => expect(response).toEqual({ dummy_response: true }),
            shouldNotFail
          );
        spec
          .expectOne("https://brokenlink/brokenapiroute", HttpMethod.GET)
          .flush({ dummy_response: true });
      });

      it("should not convert into camel case for POST requests", () => {
        http
          .post("https://brokenlink/brokenapiroute", {})
          .subscribe(
            (response) => expect(response).toEqual({ dummy_response: true }),
            shouldNotFail
          );
        spec
          .expectOne("https://brokenlink/brokenapiroute", HttpMethod.POST)
          .flush({ dummy_response: true });
      });
    });
  });

  describe("baw api traffic", () => {
    describe("outgoing data", () => {
      it("should set accept header", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Accept")).toBe("application/json");
      });

      it("should not set accept header on non json requests", () => {
        setLoggedOut();
        http
          .get(getPath("/brokenapiroute"), { responseType: "text" })
          .subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Accept")).not.toBe("application/json");
      });

      it("should set content-type header", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Content-Type")).toBe(
          "application/json"
        );
      });

      it("should not set content-type header on non json requests", () => {
        setLoggedOut();
        http
          .get(getPath("/brokenapiroute"), { responseType: "text" })
          .subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Content-Type")).not.toBe(
          "application/json"
        );
      });

      it("should set cookies", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.withCredentials).toBeTrue();
      });

      it("should convert into snake case for GET requests", () => {
        setLoggedOut();
        http
          .get(getPath("/brokenapiroute"), {
            params: new HttpParams().set("shouldConvert", "true"),
          })
          .subscribe(noop, noop);

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
          .subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.POST);
        expect(req.request.body).toEqual({ should_convert: true });
      });

      it("should not attach Authorization when unauthenticated", () => {
        setLoggedOut();
        http.get(getPath("/brokenapiroute")).subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should attach Authorization when authenticated", () => {
        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");
        http.get(getPath("/brokenapiroute")).subscribe(noop, noop);
        const req = spec.expectOne(getPath("/brokenapiroute"), HttpMethod.GET);
        expect(req.request.headers.get("Authorization")).toBe(
          'Token token="xxxxxxxxxxxxxxxxxxxx"'
        );
      });
    });

    describe("incoming data", () => {
      beforeEach(() => setLoggedOut());

      it("should convert into camel case for GET requests", () => {
        http
          .get(getPath("/brokenapiroute"))
          .subscribe(
            (response) => expect(response).toEqual({ dummyResponse: true }),
            shouldNotFail
          );

        spec
          .expectOne(getPath("/brokenapiroute"), HttpMethod.GET)
          .flush({ dummy_response: true });
      });

      it("should convert incoming data from baw api into camel case for POST requests", () => {
        http
          .post(getPath("/brokenapiroute"), {})
          .subscribe(
            (response) => expect(response).toEqual({ dummyResponse: true }),
            shouldNotFail
          );

        spec
          .expectOne(getPath("/brokenapiroute"), HttpMethod.POST)
          .flush({ dummy_response: true });
      });
    });
  });
});
