import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { SessionUser } from "@models/User";
import { AppConfigService } from "@services/app-config/app-config.service";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateSessionUser } from "@test/fakes/User";
import {
  apiErrorInfoDetails,
  shouldNotFail,
  shouldNotSucceed,
} from "./baw-api.service.spec";

describe("BawApiInterceptor", () => {
  let api: SecurityService;
  let http: HttpClient;
  let config: AppConfigService;
  let httpMock: HttpTestingController;
  let apiRoot: string;

  function errorResponse(
    url: string,
    status: number,
    statusText: string,
    error: any
  ) {
    const req = httpMock.expectOne(url);
    req.flush(
      {
        meta: {
          status,
          message: statusText,
          error,
        },
        data: null,
      },
      { status, statusText }
    );
  }

  function setLoggedIn(authToken?: string) {
    spyOn(api, "isLoggedIn").and.callFake(() => true);
    spyOn(api, "getLocalUser").and.callFake(() => {
      return authToken
        ? new SessionUser({ ...generateSessionUser(), authToken })
        : new SessionUser(generateSessionUser());
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, MockBawApiModule],
    });

    api = TestBed.inject(SecurityService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(AppConfigService);

    apiRoot = config.environment.apiRoot;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("error handling", () => {
    it("should handle api error response", () => {
      http
        .get<any>(apiRoot + "/brokenapiroute")
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(
            generateApiErrorDetails("Unauthorized", {
              message: "Incorrect user name",
            })
          );
        });

      errorResponse(apiRoot + "/brokenapiroute", 401, "Unauthorized", {
        details: "Incorrect user name",
      });
    });

    it("should handle api error response with info", () => {
      http
        .get<any>(apiRoot + "/brokenapiroute")
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(
            generateApiErrorDetails("Unprocessable Entity", {
              info: apiErrorInfoDetails.info,
            })
          );
        });

      errorResponse(apiRoot + "/brokenapiroute", 422, "Unprocessable Entity", {
        details: "Record could not be saved",
        info: apiErrorInfoDetails.info,
      });
    });

    it("should handle http error response", () => {
      http
        .get<any>(apiRoot + "/brokenapiroute")
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual({
            status: 404,
            message: `Http failure response for ${apiRoot}/brokenapiroute: 404 Page Not Found`,
            info: undefined,
          });
        });

      const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
      req.flush({}, { status: 404, statusText: "Page Not Found" });
    });
  });

  describe("non baw api traffic", () => {
    const noop = () => {};

    describe("outgoing data", () => {
      it("should not set accept header", () => {
        http.get<any>("https://brokenlink").subscribe(noop, noop, noop);

        const req = httpMock.expectOne("https://brokenlink");
        expect(req.request.headers.has("Accept")).toBeFalsy();
      });

      it("should not set Authorization header when not logged in", () => {
        http.get<any>("https://brokenlink").subscribe(noop, noop, noop);

        const req = httpMock.expectOne("https://brokenlink");
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should not set Authorization header when logged in", () => {
        setLoggedIn();
        http.get<any>("https://brokenlink").subscribe(noop, noop, noop);

        const req = httpMock.expectOne("https://brokenlink");
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should not set content-type header", () => {
        http.get<any>("https://brokenlink").subscribe(noop, noop, noop);

        const req = httpMock.expectOne("https://brokenlink");
        expect(req.request.headers.has("Content-Type")).toBeFalsy();
      });

      it("should not convert into snake case for GET requests", () => {
        const params = new HttpParams().set("shouldNotConvert", "true");

        http
          .get<any>("https://brokenlink/brokenapiroute", { params })
          .subscribe(noop, noop, noop);

        const req = httpMock.expectOne(
          "https://brokenlink/brokenapiroute?shouldNotConvert=true"
        );
        expect(req).toBeTruthy();
      });

      it("should not convert into snake case for POST requests", () => {
        http
          .post<any>("https://brokenlink/brokenapiroute", {
            shouldNotConvert: true,
          })
          .subscribe(noop, noop, noop);

        const req = httpMock.expectOne("https://brokenlink/brokenapiroute");
        expect(req.request.body).toEqual({ shouldNotConvert: true });
      });
    });

    describe("incoming data", () => {
      it("should not convert into camel case for GET requests", () => {
        http
          .get<any>("https://brokenlink/brokenapiroute")
          .subscribe((response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual({ dummy_response: true });
          }, shouldNotFail);

        const req = httpMock.expectOne("https://brokenlink/brokenapiroute");
        req.flush({ dummy_response: true });
      });

      it("should not convert into camel case for POST requests", () => {
        http
          .post<any>("https://brokenlink/brokenapiroute", {})
          .subscribe((response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual({ dummy_response: true });
          }, shouldNotFail);

        const req = httpMock.expectOne("https://brokenlink/brokenapiroute");
        req.flush({ dummy_response: true });
      });
    });
  });

  describe("baw api traffic", () => {
    const noop = () => {};

    describe("outgoing data", () => {
      it("should set accept header", () => {
        http.get<any>(apiRoot + "/brokenapiroute").subscribe(noop, noop, noop);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        expect(req.request.headers.has("Accept")).toBeTruthy();
        expect(req.request.headers.get("Accept")).toBe("application/json");
      });

      it("should set content-type header", () => {
        http.get<any>(apiRoot + "/brokenapiroute").subscribe(noop, noop, noop);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        expect(req.request.headers.has("Content-Type")).toBeTruthy();
        expect(req.request.headers.get("Content-Type")).toBe(
          "application/json"
        );
      });

      it("should convert into snake case for GET requests", () => {
        const params = new HttpParams().set("shouldConvert", "true");

        http
          .get<any>(apiRoot + "/brokenapiroute", {
            params,
          })
          .subscribe(noop, noop, noop);

        const req = httpMock.expectOne(
          apiRoot + "/brokenapiroute?should_convert=true"
        );
        expect(req).toBeTruthy();
      });

      it("should convert into snake case for POST requests", () => {
        http
          .post<any>(apiRoot + "/brokenapiroute", {
            shouldConvert: true,
          })
          .subscribe(noop, noop, noop);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        expect(req.request.body).toEqual({ should_convert: true });
      });

      it("should not attach Authorization when unauthenticated", () => {
        http.get<any>(apiRoot + "/brokenapiroute").subscribe(noop, noop, noop);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        expect(req.request.headers.has("Authorization")).toBeFalsy();
      });

      it("should attach Authorization when authenticated", () => {
        setLoggedIn("xxxxxxxxxxxxxxxxxxxx");

        http.get<any>(apiRoot + "/brokenapiroute").subscribe(noop, noop, noop);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        expect(req.request.headers.has("Authorization")).toBeTruthy();
        expect(req.request.headers.get("Authorization")).toBe(
          'Token token="xxxxxxxxxxxxxxxxxxxx"'
        );
      });
    });

    describe("incoming data", () => {
      it("should convert into camel case for GET requests", () => {
        http.get<any>(apiRoot + "/brokenapiroute").subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual({ dummyResponse: true });
        }, shouldNotFail);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        req.flush({ dummy_response: true });
      });

      it("should convert incoming data from baw api into camel case for POST requests", () => {
        http
          .post<any>(apiRoot + "/brokenapiroute", {})
          .subscribe((response) => {
            expect(response).toBeTruthy();
            expect(response).toEqual({ dummyResponse: true });
          }, shouldNotFail);

        const req = httpMock.expectOne(apiRoot + "/brokenapiroute");
        req.flush({ dummy_response: true });
      });
    });
  });
});
