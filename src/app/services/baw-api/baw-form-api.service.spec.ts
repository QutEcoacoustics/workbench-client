import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateApiErrorResponse } from "@test/fakes/ApiErrorDetails";
import { modelData } from "@test/helpers/faker";
import { getCallArgs, nStepObservable } from "@test/helpers/general";
import { noop, Subject } from "rxjs";
import { ApiErrorDetails, BawApiInterceptor } from "./api.interceptor.service";
import { STUB_MODEL_BUILDER, unknownErrorCode } from "./baw-api.service";
import { shouldNotFail, shouldNotSucceed } from "./baw-api.service.spec";
import { BawFormApiService } from "./baw-form-api.service";
import { MockShowApiService } from "./mock/apiMocks.service";
import { MockForm } from "./mock/bawFormApiMock.service";
import { MockSecurityService } from "./mock/securityMock.service";
import { SecurityService } from "./security/security.service";
import { UserService } from "./user/user.service";

describe("bawFormApiService", () => {
  let apiRoot: string;
  let spec: SpectatorHttp<BawFormApiService<MockForm>>;
  const createService = createHttpFactory<BawFormApiService<MockForm>>({
    service: BawFormApiService,
    imports: [MockAppConfigModule],
    providers: [
      { provide: SecurityService, useClass: MockSecurityService },
      { provide: UserService, useClass: MockShowApiService },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
      { provide: STUB_MODEL_BUILDER, useValue: MockForm },
    ],
  });

  function intercept(spy: any, response: any, error: ApiErrorDetails) {
    const subject = new Subject();
    spy.and.callFake(() => subject);
    return nStepObservable(subject, () => response ?? error, !!error);
  }

  beforeEach(() => {
    localStorage.clear();
    spec = createService();
    apiRoot = spec.inject(API_ROOT);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("makeFormRequest", () => {
    let defaultBody: URLSearchParams;
    let successHtmlRequestPage: string;
    let apiHtmlRequestSpy: jasmine.Spy;
    let apiFormRequestSpy: jasmine.Spy;

    function makeFormRequest(
      formEndpoint: string,
      submissionEndpoint: string,
      body: (authToken: string) => URLSearchParams
    ) {
      return spec.service["makeFormRequest"](
        formEndpoint,
        submissionEndpoint,
        body
      );
    }

    function interceptHtmlRequest(response: string, error?: ApiErrorDetails) {
      apiHtmlRequestSpy = jasmine.createSpy("apiHtmlRequest");
      spec.service["apiHtmlRequest"] = apiHtmlRequestSpy;
      return intercept(apiHtmlRequestSpy, response, error);
    }

    function interceptFormRequest(response: string, error?: ApiErrorDetails) {
      apiFormRequestSpy = jasmine.createSpy("apiFormRequest");
      spec.service["apiFormRequest"] = apiFormRequestSpy;
      return intercept(apiFormRequestSpy, response, error);
    }

    beforeEach(() => {
      defaultBody = new URLSearchParams();
      successHtmlRequestPage = `<html><input name="authenticity_token" value="${modelData.authToken()}" /></html>`;
    });

    it("should call apiHtmlRequest", () => {
      interceptHtmlRequest("<html></html>");
      makeFormRequest(
        "/broken_html_link",
        "/broken_link",
        () => defaultBody
      ).subscribe(noop, noop);
      expect(apiHtmlRequestSpy).toHaveBeenCalledWith("/broken_html_link");
    });

    it("should throw error if token is not found", (done) => {
      interceptHtmlRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_link",
        () => defaultBody
      ).subscribe(shouldNotSucceed, (err) => {
        expect(err).toEqual({
          status: unknownErrorCode,
          message: "Unable to retrieve authenticity token for form request.",
        } as ApiErrorDetails);
        done();
      });
    });

    it("should call apiFormRequest with submission endpoint", async () => {
      const promise = interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe(noop, noop);
      await promise;
      expect(getCallArgs(apiFormRequestSpy)[0]).toBe("/broken_form_link");
    });

    it("should call apiFormRequest with body", async () => {
      const body = (_authToken: string): URLSearchParams => {
        defaultBody.set("user[example]", "example value");
        defaultBody.set("authToken", _authToken);
        return defaultBody;
      };
      const authToken = modelData.authToken();
      const promise = interceptHtmlRequest(
        `<html><input name="authenticity_token" value="${authToken}" /></html>`
      );
      interceptFormRequest("<html></html>");
      makeFormRequest("/broken_link", "/broken_form_link", (_authToken) =>
        body(_authToken)
      ).subscribe(noop, noop);
      await promise;
      expect(getCallArgs(apiFormRequestSpy)[1].toString()).toBe(
        "user%5Bexample%5D=example+value&authToken=" + authToken
      );
    });

    it("should throw error if recaptcha error message in response", (done) => {
      interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest(`
        <html><p class='help-block'>
          Captcha response was not correct. Please try again.
        </p></html>
      `);
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe(shouldNotSucceed, (err) => {
        expect(err).toEqual({
          status: unknownErrorCode,
          message: "Captcha response was not correct.",
        } as ApiErrorDetails);
        done();
      });
    });

    it("should return page of successful response", (done) => {
      interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe((page: string) => {
        expect(page).toBe("<html></html>");
        done();
      }, shouldNotFail);
    });

    it("should complete on success", (done) => {
      interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe(noop, noop, () => {
        expect(true).toBeTrue();
        done();
      });
    });
  });

  describe("getRecaptchaSeed", () => {
    let apiHtmlRequestSpy: jasmine.Spy;

    function interceptHtmlRequest(page: string, error?: ApiErrorDetails) {
      apiHtmlRequestSpy = jasmine.createSpy("apiHtmlRequest");
      spec.service["apiHtmlRequest"] = apiHtmlRequestSpy;
      return intercept(apiHtmlRequestSpy, page, error);
    }

    function getRecaptchaSeed(page: string, extractSeed?: RegExp) {
      return spec.service["getRecaptchaSeed"](page, extractSeed);
    }

    it("should call apiHtmlRequest", () => {
      interceptHtmlRequest("<html></html>");
      getRecaptchaSeed("/broken_link").subscribe(noop, noop);
      expect(apiHtmlRequestSpy).toHaveBeenCalledWith("/broken_link");
    });

    it("should extract seed from page", (done) => {
      const seed = modelData.authToken();
      interceptHtmlRequest(
        `<html><input id="g-recaptcha-response-data-register" data-sitekey="${seed}"></input></html>`
      );
      getRecaptchaSeed("/broken_link").subscribe((_seed) => {
        expect(_seed).toBe(seed);
        done();
      }, shouldNotFail);
    });

    it("should throw error if failed to extract seed from page", (done) => {
      interceptHtmlRequest("<html></html>");
      getRecaptchaSeed("/broken_link").subscribe(shouldNotSucceed, (err) => {
        expect(err).toEqual({
          status: unknownErrorCode,
          message: "Unable to setup recaptcha.",
        } as ApiErrorDetails);
        done();
      });
    });

    it("should complete on success", (done) => {
      const seed = modelData.authToken();
      interceptHtmlRequest(
        `<html><input id="g-recaptcha-response-data-register" data-sitekey="${seed}"></input></html>`
      );
      getRecaptchaSeed("/broken_link").subscribe(noop, noop, () => {
        expect(true).toBeTrue();
        done();
      });
    });
  });

  describe("apiHtmlRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(apiRoot + path, HttpMethod.GET);
    }

    function apiHtmlRequest(path: string) {
      return spec.service["apiHtmlRequest"](path);
    }

    it("should create get request", () => {
      apiHtmlRequest("/broken_link").subscribe(noop, noop);
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      apiHtmlRequest("/broken_link").subscribe(noop, noop);
      const responseType = interceptRequest("/broken_link").request
        .responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      apiHtmlRequest("/broken_link").subscribe(noop, noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should not set content type headers", () => {
      apiHtmlRequest("/broken_link").subscribe(noop, noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Content-Type")).not.toBeTruthy();
    });

    it("should return page contents", (done) => {
      const response = "<html></html>";
      apiHtmlRequest("/broken_link").subscribe((page) => {
        expect(page).toBe(response);
        done();
      });
      interceptRequest("/broken_link").flush(response);
    });

    it("should handle api error", (done) => {
      apiHtmlRequest("/broken_link").subscribe(shouldNotSucceed, (err) => {
        expect(err?.status).toBe(500);
        done();
      });
      interceptRequest("/broken_link").flush(
        generateApiErrorResponse("Internal Server Error"),
        { status: 500, statusText: "Internal Server Error" }
      );
    });

    it("should complete on success", (done) => {
      apiHtmlRequest("/broken_link").subscribe(noop, noop, () => {
        expect(true).toBeTruthy();
        done();
      });
      interceptRequest("/broken_link").flush("<html></html>");
    });
  });

  describe("apiFormRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(apiRoot + path, HttpMethod.POST);
    }

    function apiFormRequest(
      path: string,
      formData: URLSearchParams = new URLSearchParams()
    ) {
      return spec.service["apiFormRequest"](path, formData);
    }

    it("should create post request", () => {
      apiFormRequest("/broken_link").subscribe(noop, noop);
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      apiFormRequest("/broken_link").subscribe(noop, noop);
      const responseType = interceptRequest("/broken_link").request
        .responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      apiFormRequest("/broken_link").subscribe(noop, noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should set content type header to form-urlencoded", () => {
      apiFormRequest("/broken_link").subscribe(noop, noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Content-Type")).toBe(
        "application/x-www-form-urlencoded"
      );
    });

    it("should insert form data", () => {
      const formData = new URLSearchParams({
        "user[login]": "example username",
        "user[password]": "Ex@mp1e_P@55w0rd+=",
      });
      apiFormRequest("/broken_link", formData).subscribe(noop, noop);
      const body = interceptRequest("/broken_link").request.body;
      expect(body).toBe(
        "user%5Blogin%5D=example+username&" +
          "user%5Bpassword%5D=Ex%40mp1e_P%4055w0rd%2B%3D"
      );
    });

    it("should handle api error", (done) => {
      apiFormRequest("/broken_link").subscribe(shouldNotSucceed, (err) => {
        expect(err?.status).toBe(500);
        done();
      });
      interceptRequest("/broken_link").flush(
        generateApiErrorResponse("Internal Server Error"),
        { status: 500, statusText: "Internal Server Error" }
      );
    });

    it("should complete on success", (done) => {
      apiFormRequest("/broken_link").subscribe(noop, noop, () => {
        expect(true).toBeTruthy();
        done();
      });
      interceptRequest("/broken_link").flush("<html></html>");
    });
  });
});
