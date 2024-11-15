import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import { Errorable } from "@helpers/advancedTypes";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import {
  createHttpFactory,
  HttpMethod,
  mockProvider,
  SpectatorHttp,
  SpyObject,
} from "@ngneat/spectator";
import { CacheModule } from "@services/cache/cache.module";
import { MockConfigModule } from "@services/config/configMock.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { modelData } from "@test/helpers/faker";
import { assertOk, getCallArgs, nStepObservable } from "@test/helpers/general";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { ToastrService } from "ngx-toastr";
import { noop, Subject } from "rxjs";
import { mockAssociationInjector } from "@services/association-injector/association-injectorMock.factory";
import { NgHttpCachingService } from "ng-http-caching";
import { BawApiInterceptor } from "./api.interceptor.service";
import { BawApiService, unknownErrorCode } from "./baw-api.service";
import { shouldNotFail, shouldNotSucceed } from "./baw-api.service.spec";
import { BawFormApiService } from "./baw-form-api.service";
import { BawSessionService } from "./baw-session.service";
import { MockForm } from "./mock/bawFormApiMock.service";

describe("BawFormApiService", () => {
  let api: BawApiService<MockForm>;
  let cachingSpy: SpyObject<NgHttpCachingService>;
  let spec: SpectatorHttp<BawFormApiService<MockForm>>;

  const createService = createHttpFactory<BawFormApiService<MockForm>>({
    service: BawFormApiService,
    imports: [MockConfigModule, CacheModule],
    providers: [
      BawSessionService,
      BawApiService,
      mockProvider(ToastrService),
      mockAssociationInjector,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
    ],
  });

  function interceptHtmlRequest(page: Errorable<string>) {
    const subject = new Subject<string>();
    spyOn(spec.service, "htmlRequest").and.callFake(() => subject);
    return nStepObservable(subject, () => page, isBawApiError(page));
  }

  function interceptFormRequest(response: Errorable<string>) {
    const subject = new Subject<string>();
    spyOn(spec.service, "formRequest").and.callFake(() => subject);
    return nStepObservable(subject, () => response, isBawApiError(response));
  }

  beforeEach(() => {
    spec = createService();
    api = spec.inject<BawApiService<MockForm>>(BawApiService);
    cachingSpy = spec.inject(NgHttpCachingService);
  });

  afterEach(() => {
    cachingSpy.clearCache();
  });

  describe("makeFormRequest", () => {
    let defaultBody: URLSearchParams;
    let successHtmlRequestPage: string;

    function makeFormRequest(
      formEndpoint: string,
      submissionEndpoint: string,
      body: (authToken: string) => URLSearchParams
    ) {
      return spec.service.makeFormRequest(
        formEndpoint,
        submissionEndpoint,
        body
      );
    }

    function formRequestCalls() {
      return getCallArgs(spec.service.formRequest as jasmine.Spy);
    }

    beforeEach(() => {
      defaultBody = new URLSearchParams();
      successHtmlRequestPage = `<html><input name="authenticity_token" value="${modelData.authToken()}" /></html>`;
    });

    it("should call htmlRequest", () => {
      interceptHtmlRequest("<html></html>");
      makeFormRequest(
        "/broken_html_link",
        "/broken_link",
        () => defaultBody
      ).subscribe({ next: noop, error: noop });
      expect(spec.service.htmlRequest).toHaveBeenCalledWith(
        "/broken_html_link"
      );
    });

    it("should throw error if token is not found", (done) => {
      interceptHtmlRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_link",
        () => defaultBody
      ).subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(
            new BawApiError(
              unknownErrorCode,
              "Unable to retrieve authenticity token for form request."
            )
          );
          done();
        },
      });
    });

    it("should call formRequest with submission endpoint", async () => {
      const promise = interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe(noop);
      await promise;
      expect(formRequestCalls()[0]).toBe("/broken_form_link");
    });

    it("should call formRequest with body", async () => {
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
      ).subscribe(noop);
      await promise;
      expect(formRequestCalls()[1].toString()).toBe(
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
      ).subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(
            new BawApiError(
              unknownErrorCode,
              "Captcha response was not correct."
            )
          );
          done();
        },
      });
    });

    it("should return page of successful response", (done) => {
      interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe({
        next: (page: string) => {
          expect(page).toBe("<html></html>");
          done();
        },
        error: shouldNotFail,
      });
    });

    it("should complete on success", (done) => {
      interceptHtmlRequest(successHtmlRequestPage);
      interceptFormRequest("<html></html>");
      makeFormRequest(
        "/broken_link",
        "/broken_form_link",
        () => defaultBody
      ).subscribe({
        complete: () => {
          assertOk();
          done();
        },
      });
    });
  });

  describe("getRecaptchaSeed", () => {
    function getRecaptchaSeed(page: string) {
      return spec.service.getRecaptchaSeed(page);
    }

    it("should call htmlRequest", () => {
      interceptHtmlRequest("<html></html>");
      getRecaptchaSeed("/broken_link").subscribe({ next: noop, error: noop });
      expect(spec.service.htmlRequest).toHaveBeenCalledWith("/broken_link");
    });

    it("should extract seed from page", (done) => {
      const seed = modelData.authToken();
      const action = "test_action";
      interceptHtmlRequest(
        `grecaptcha.execute('${seed}', {action: '${action}'})`
      );
      getRecaptchaSeed("/broken_link").subscribe({
        next: (settings) => {
          expect(settings.seed).toBe(seed);
          done();
        },
        error: shouldNotFail,
      });
    });

    it("should extract action from page", (done) => {
      const seed = modelData.authToken();
      const action = "test_action";
      interceptHtmlRequest(
        `grecaptcha.execute('${seed}', {action: '${action}'})`
      );
      getRecaptchaSeed("/broken_link").subscribe({
        next: (settings) => {
          expect(settings.action).toBe(action);
          done();
        },
        error: shouldNotFail,
      });
    });

    it("should throw error if failed to extract seed from page", (done) => {
      interceptHtmlRequest("<html></html>");
      getRecaptchaSeed("/broken_link").subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(
            new BawApiError(unknownErrorCode, "Unable to setup recaptcha.")
          );
          done();
        },
      });
    });

    it("should complete on success", (done) => {
      const seed = modelData.authToken();
      const action = "test_action";
      interceptHtmlRequest(
        `grecaptcha.execute('${seed}', {action: '${action}'})`
      );
      getRecaptchaSeed("/broken_link").subscribe({
        complete: () => {
          assertOk();
          done();
        },
      });
    });
  });

  describe("htmlRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(api.getPath(path), HttpMethod.GET);
    }

    function apiHtmlRequest(path: string) {
      return spec.service.htmlRequest(path);
    }

    it("should create get request", () => {
      apiHtmlRequest("/broken_link").subscribe(noop);
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      apiHtmlRequest("/broken_link").subscribe(noop);
      const responseType =
        interceptRequest("/broken_link").request.responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      apiHtmlRequest("/broken_link").subscribe(noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should not set content type headers", () => {
      apiHtmlRequest("/broken_link").subscribe(noop);
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
      apiHtmlRequest("/broken_link").subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err?.status).toBe(INTERNAL_SERVER_ERROR);
          done();
        },
      });
      interceptRequest("/broken_link").flush(
        generateBawApiError(INTERNAL_SERVER_ERROR),
        { status: INTERNAL_SERVER_ERROR, statusText: "Internal Server Error" }
      );
    });

    it("should complete on success", (done) => {
      apiHtmlRequest("/broken_link").subscribe({
        complete: () => {
          assertOk();
          done();
        },
      });
      interceptRequest("/broken_link").flush("<html></html>");
    });
  });

  describe("formRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(api.getPath(path), HttpMethod.POST);
    }

    function apiFormRequest(
      path: string,
      formData: URLSearchParams = new URLSearchParams()
    ) {
      return spec.service.formRequest(path, formData);
    }

    it("should create post request", () => {
      apiFormRequest("/broken_link").subscribe(noop);
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      apiFormRequest("/broken_link").subscribe(noop);
      const responseType =
        interceptRequest("/broken_link").request.responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      apiFormRequest("/broken_link").subscribe(noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should set content type header to form-urlencoded", () => {
      apiFormRequest("/broken_link").subscribe(noop);
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Content-Type")).toBe(
        "application/x-www-form-urlencoded"
      );
    });

    it("should insert form data", () => {
      const formData = new URLSearchParams({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "user[login]": "example username",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "user[password]": "Ex@mp1e_P@55w0rd+=",
      });
      apiFormRequest("/broken_link", formData).subscribe(noop);
      const body = interceptRequest("/broken_link").request.body;
      expect(body).toBe(
        "user%5Blogin%5D=example+username&" +
          "user%5Bpassword%5D=Ex%40mp1e_P%4055w0rd%2B%3D"
      );
    });

    it("should handle api error", (done) => {
      apiFormRequest("/broken_link").subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err?.status).toBe(INTERNAL_SERVER_ERROR);
          done();
        },
      });
      interceptRequest("/broken_link").flush(
        generateBawApiError(INTERNAL_SERVER_ERROR),
        { status: INTERNAL_SERVER_ERROR, statusText: "Internal Server Error" }
      );
    });

    it("should complete on success", (done) => {
      apiFormRequest("/broken_link").subscribe({
        complete: () => {
          assertOk();
          done();
        },
      });
      interceptRequest("/broken_link").flush("<html></html>");
    });
  });
});
