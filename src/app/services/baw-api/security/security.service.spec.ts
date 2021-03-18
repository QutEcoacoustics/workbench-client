import { ok } from "assert";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import { MockShowApiService } from "@baw-api/mock/apiMocks.service";
import { SessionUser, User } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import {
  generateApiErrorDetails,
  generateApiErrorResponse,
} from "@test/fakes/ApiErrorDetails";
import { generateLoginDetails } from "@test/fakes/LoginDetails";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { BehaviorSubject, noop, Subject } from "rxjs";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "../baw-api.service.spec";
import { UserService } from "../user/user.service";
import {
  LoginDetails,
  RegisterDetails,
  SecurityService,
} from "./security.service";

describe("SecurityService", () => {
  let apiRoot: string;
  let defaultUser: User;
  let defaultSessionUser: SessionUser;
  let defaultRegisterDetails: RegisterDetails;
  let defaultLoginDetails: LoginDetails;
  let defaultError: ApiErrorDetails;
  let defaultAuthToken: string;
  let userApi: UserService;
  let spec: SpectatorHttp<SecurityService>;
  const createService = createHttpFactory({
    service: SecurityService,
    imports: [MockAppConfigModule],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
      { provide: UserService, useClass: MockShowApiService },
    ],
  });

  function intercept(spy: any, response: any, error: ApiErrorDetails) {
    const subject = new Subject<string>();
    spy.and.callFake(() => subject);
    return nStepObservable(subject, () => response ?? error, !!error);
  }

  function interceptHtmlRequest(page: any, error?: ApiErrorDetails) {
    const spy = jasmine.createSpy("formHtmlRequest");
    spec.service["formHtmlRequest"] = spy;
    return intercept(spy, page, error);
  }

  function interceptDataRequest(error?: ApiErrorDetails) {
    const spy = jasmine.createSpy("formDataRequest");
    spec.service["formDataRequest"] = spy;
    return intercept(spy, !error ? "<html></html>" : undefined, error);
  }

  function interceptSessionUser(model: SessionUser, error?: ApiErrorDetails) {
    const spy = jasmine.createSpy("apiShow");
    spec.service["apiShow"] = spy;
    return intercept(spy, model, error);
  }

  function interceptUser(model: User, error?: ApiErrorDetails) {
    const spy = spyOn(userApi, "show");
    return intercept(spy, model, error);
  }

  beforeEach(() => {
    localStorage.clear();

    spec = createService();
    userApi = spec.inject(UserService);
    apiRoot = spec.inject(ConfigService).environment.apiRoot;

    defaultAuthToken = modelData.random.alphaNumeric(20);
    defaultError = generateApiErrorDetails();
    defaultUser = new User(generateUser());
    defaultSessionUser = new SessionUser({
      ...defaultUser,
      ...generateSessionUser(),
    });
    defaultRegisterDetails = new RegisterDetails(generateRegisterDetails());
    defaultLoginDetails = new LoginDetails(generateLoginDetails());
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("initial state", () => {
    it("isLoggedIn should return false", () => {
      expect(spec.service.isLoggedIn()).toBeFalse();
    });

    it("getSessionUser should return null", () => {
      expect(spec.service.getLocalUser()).toBeFalsy();
    });

    it("authTrigger should return null", (done) => {
      spec.service.getAuthTrigger().subscribe(
        (val) => {
          expect(val).toBeNull();
          done();
        },
        shouldNotFail,
        shouldNotComplete
      );
    });
  });

  describe("signUpSeed", () => {
    it("should call formHtmlRequest", () => {
      interceptHtmlRequest("<html></html>");
      spec.service.signUpSeed().subscribe(noop, noop);
      expect(spec.service["formHtmlRequest"]).toHaveBeenCalledWith(
        "/my_account/sign_up/"
      );
    });

    it("should return recaptcha seed", (done) => {
      const seed = modelData.random.alphaNumeric(50);
      interceptHtmlRequest(
        `<input id="g-recaptcha-response-data-register" data-sitekey="${seed}"></input>`
      );
      spec.service.signUpSeed().subscribe((_seed: string) => {
        expect(_seed).toBe(seed);
        done();
      }, shouldNotFail);
    });

    it("should throw error if page is invalid", (done) => {
      interceptHtmlRequest(123456789);
      spec.service
        .signUpSeed()
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err.message).toBe("Failed to retrieve auth form");
          done();
        });
    });

    it("should throw error if no recaptcha seed", (done) => {
      interceptHtmlRequest("<html></html>");
      spec.service
        .signUpSeed()
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err.message).toBe(
            "Unable to retrieve recaptcha seed for registration request"
          );
          done();
        });
    });
  });

  describe("authentication methods", () => {
    function interceptAuth() {
      spec.service["handleAuth"] = jasmine.createSpy("handleAuth").and.stub();
    }

    function getCallArgs() {
      return (spec.service["handleAuth"] as jasmine.Spy).calls.mostRecent()
        .args;
    }

    function getFormDataArgs(): (page: string) => URLSearchParams {
      return getCallArgs()[2];
    }

    describe("signIn", () => {
      it("should call handleAuth", () => {
        interceptAuth();
        spec.service.signIn(defaultLoginDetails);
        expect(spec.service["handleAuth"]).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", () => {
        interceptAuth();
        spec.service.signIn(defaultLoginDetails);
        expect(getCallArgs()[0]).toBe("/my_account/sign_in/");
      });

      it("should call handleAuth with correct auth endpoint", () => {
        interceptAuth();
        spec.service.signIn(defaultLoginDetails);
        expect(getCallArgs()[1]).toBe("/my_account/sign_in/");
      });

      it("should set request body", () => {
        const loginDetails = new LoginDetails({
          login: "sign_in details",
          password: "sign_in password",
        });
        const page = `<input name="authenticity_token" value="${defaultAuthToken}"></input>`;
        const expectation =
          "user%5Blogin%5D=sign_in+details&" +
          "user%5Bpassword%5D=sign_in+password&" +
          "user%5Bremember_me%5D=0&" +
          "commit=Log%2Bin&" +
          `authenticity_token=${defaultAuthToken}`;

        interceptAuth();
        spec.service.signIn(loginDetails);
        expect(getFormDataArgs()(page).toString()).toBe(expectation);
      });

      it("should throw error if no authenticity token", () => {
        interceptAuth();
        spec.service.signIn(defaultLoginDetails);
        expect(function () {
          getFormDataArgs()("");
        }).toThrowError();
      });
    });

    describe("signUp", () => {
      it("should call handleAuth", () => {
        interceptAuth();
        spec.service.signUp(defaultRegisterDetails);
        expect(spec.service["handleAuth"]).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", () => {
        interceptAuth();
        spec.service.signUp(defaultRegisterDetails);
        expect(getCallArgs()[0]).toBe("/my_account/sign_up/");
      });

      it("should call handleAuth with correct auth endpoint", () => {
        interceptAuth();
        spec.service.signUp(defaultRegisterDetails);
        expect(getCallArgs()[1]).toBe("/my_account/");
      });

      it("should set request body", () => {
        const registerDetails = new RegisterDetails({
          email: "sign_up@email.com",
          userName: "sign_up details",
          password: "sign_up password",
          passwordConfirmation: "sign_up password",
          recaptchaToken: "xxxxxxxxxx",
        });
        const page = `<input name="authenticity_token" value="${defaultAuthToken}"></input>`;
        const expectation =
          "user%5Buser_name%5D=sign_up+details&" +
          "user%5Bemail%5D=sign_up%40email.com&" +
          "user%5Bpassword%5D=sign_up+password&" +
          "user%5Bpassword_confirmation%5D=sign_up+password&" +
          "commit=Register&" +
          `authenticity_token=${defaultAuthToken}&` +
          "g-recaptcha-response-data%5Bregister%5D=xxxxxxxxxx&" +
          "g-recaptcha-response=";

        interceptAuth();
        spec.service.signUp(registerDetails);
        expect(getFormDataArgs()(page).toString()).toBe(expectation);
      });

      it("should throw error if no authenticity token", () => {
        interceptAuth();
        spec.service.signUp(defaultRegisterDetails);
        expect(function () {
          getFormDataArgs()("");
        }).toThrowError();
      });

      it("should throw error if no recaptcha token", () => {
        const registerDetails = new RegisterDetails({
          ...defaultRegisterDetails,
          recaptchaToken: null,
        });
        const page = `<input name="authenticity_token" value="${defaultAuthToken}"></input>`;

        interceptAuth();
        spec.service.signUp(registerDetails);
        expect(function () {
          getFormDataArgs()(page);
        }).toThrowError();
      });
    });
  });

  describe("handleAuth", () => {
    function handleAuth(inputs?: {
      formEndpoint?: string;
      authEndpoint?: string;
      getFormData?: (page: string) => URLSearchParams;
      next?: (value: string) => void;
      error?: (error: any) => void;
      complete?: () => void;
    }) {
      spec.service["handleAuth"](
        inputs?.formEndpoint ?? "/broken_link",
        inputs?.authEndpoint ?? "/broken_link",
        inputs?.getFormData ?? (() => new URLSearchParams())
      ).subscribe(
        inputs?.next ?? noop,
        inputs?.error ?? noop,
        inputs?.complete
      );
    }

    describe("1st Request: formHtmlRequest", () => {
      beforeEach(() => {
        interceptDataRequest();
        interceptSessionUser(defaultSessionUser);
        interceptUser(defaultUser);
      });

      it("should call formHtmlRequest", async () => {
        interceptHtmlRequest("<html></html>");
        handleAuth({ formEndpoint: "/form_html_link" });
        expect(spec.service["formHtmlRequest"]).toHaveBeenCalled();
      });

      it("should call formHtmlRequest with path", async () => {
        interceptHtmlRequest("<html></html>");
        handleAuth({ formEndpoint: "/form_html_link" });
        expect(spec.service["formHtmlRequest"]).toHaveBeenCalledWith(
          "/form_html_link"
        );
      });

      it("should handle invalid formHtmlRequest response", (done) => {
        interceptHtmlRequest(123456789);
        handleAuth({
          error: (err: ApiErrorDetails) => {
            expect(err.message).toEqual("Failed to retrieve auth form");
            done();
          },
        });
      });

      it("should handle formHtmlRequest failure", (done) => {
        interceptHtmlRequest(undefined, defaultError);
        handleAuth({
          error: (err) => {
            expect(err).toEqual(defaultError);
            done();
          },
        });
      });
    });

    describe("2nd Request: formDataRequest", () => {
      let initialRequests: Promise<any>;

      beforeEach(() => {
        initialRequests = interceptHtmlRequest("<html></html>");
        interceptSessionUser(defaultSessionUser);
        interceptUser(defaultUser);
      });

      it("should call formDataRequest", async () => {
        const formData = new URLSearchParams({ test: "example" });
        interceptDataRequest();
        handleAuth({
          authEndpoint: "/form_data_link",
          getFormData: () => formData,
        });
        await initialRequests;
        expect(spec.service["formDataRequest"]).toHaveBeenCalled();
      });

      it("should call formDataRequest with path and formData", async () => {
        const formData = new URLSearchParams({ test: "example" });
        interceptDataRequest();
        handleAuth({
          authEndpoint: "/form_data_link",
          getFormData: () => formData,
        });
        await initialRequests;
        expect(spec.service["formDataRequest"]).toHaveBeenCalledWith(
          "/form_data_link",
          formData
        );
      });

      it("should handle getFormData throwing error", (done) => {
        interceptDataRequest();
        handleAuth({
          getFormData: () => {
            throw new Error("custom error message");
          },
          error: (err: ApiErrorDetails) => {
            expect(err.message).toBe("custom error message");
            done();
          },
        });
      });

      it("should handle formDataRequest failure", (done) => {
        interceptDataRequest(defaultError);
        handleAuth({
          error: (err: ApiErrorDetails) => {
            expect(err).toEqual(defaultError);
            done();
          },
        });
      });
    });

    describe("3rd Request: Get session user", () => {
      let initialRequests: Promise<any>;

      beforeEach(() => {
        initialRequests = Promise.all([
          interceptHtmlRequest("<html></html>"),
          interceptDataRequest(),
        ]);
        interceptUser(defaultUser);
      });

      it("should request session user details", async () => {
        interceptSessionUser(defaultSessionUser);
        handleAuth();
        await initialRequests;
        expect(spec.service["apiShow"]).toHaveBeenCalled();
      });

      it("should request session user details with anti cache timestamp", async () => {
        interceptSessionUser(defaultSessionUser);
        handleAuth();
        await initialRequests;

        // Validate timestamp within 1000 ms
        const timestamp = Math.floor(Date.now() / 1000);
        const argument = (spec.service[
          "apiShow"
        ] as jasmine.Spy).calls.mostRecent().args[0];
        expect(argument).toContain("/security/user?antiCache=" + timestamp);
      });

      it("should handle session user details failure", (done) => {
        interceptSessionUser(undefined, defaultError);
        handleAuth({
          error: (err: ApiErrorDetails) => {
            expect(err).toEqual(defaultError);
            done();
          },
        });
      });
    });

    describe("4th Request: Get user", () => {
      let initialRequests: Promise<any>;

      beforeEach(() => {
        initialRequests = Promise.all([
          interceptHtmlRequest("<html></html>"),
          interceptDataRequest(),
          interceptSessionUser(defaultSessionUser),
        ]);
      });

      it("should request user details", async () => {
        interceptUser(defaultUser);
        handleAuth();
        await initialRequests;
        expect(userApi.show).toHaveBeenCalled();
      });

      it("should handle user details failure", (done) => {
        interceptUser(undefined, defaultError);
        handleAuth({
          error: (err: ApiErrorDetails) => {
            expect(err).toEqual(defaultError);
            done();
          },
        });
      });
    });

    describe("success", () => {
      async function interceptRequests() {
        return Promise.all([
          interceptHtmlRequest("<html></html>"),
          interceptDataRequest(),
          interceptSessionUser(defaultSessionUser),
          interceptUser(defaultUser),
        ]);
      }

      it("should store session user in local storage", async () => {
        const promise = interceptRequests();
        handleAuth();
        await promise;
        expect(spec.service.getLocalUser()).toEqual(
          new SessionUser({
            ...defaultSessionUser.toJSON(),
            ...defaultUser.toJSON(),
          })
        );
      });

      it("should trigger authTrigger", async () => {
        const trigger = spec.service.getAuthTrigger();
        trigger.subscribe(noop, noop, shouldNotComplete);
        spyOn(trigger, "next").and.callThrough();
        expect(trigger.next).toHaveBeenCalledTimes(0);
        const promise = interceptRequests();
        handleAuth();
        await promise;
        expect(trigger.next).toHaveBeenCalledTimes(1);
      });

      it("should call next", (done) => {
        interceptRequests();
        handleAuth({
          next: () => {
            expect(true).toBeTrue();
            done();
          },
          error: shouldNotFail,
        });
      });

      it("should complete observable", (done) => {
        interceptRequests();
        handleAuth({
          error: shouldNotFail,
          complete: () => {
            expect(true).toBeTrue();
            done();
          },
        });
      });
    });

    describe("error", () => {
      it("should call clearData", async () => {
        spec.service["clearData"] = jasmine.createSpy("clearData").and.stub();
        spec.service["storeLocalUser"](defaultSessionUser);
        const promise = interceptHtmlRequest(undefined, defaultError);
        handleAuth();
        await promise;
        expect(spec.service["clearData"]).toHaveBeenCalled();
      });
    });
  });

  describe("formHtmlRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(apiRoot + path, HttpMethod.GET);
    }

    function formHtmlRequest(
      path: string,
      next: (value: string) => void = noop,
      error: (error: any) => void = noop
    ) {
      spec.service["formHtmlRequest"](path).subscribe(next, error);
    }

    it("should create get request", () => {
      formHtmlRequest("/broken_link");
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      formHtmlRequest("/broken_link");
      const responseType = interceptRequest("/broken_link").request
        .responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      formHtmlRequest("/broken_link");
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should not set content type headers", () => {
      formHtmlRequest("/broken_link");
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Content-Type")).not.toBeTruthy();
    });

    it("should return page contents", (done) => {
      const response = "<html></html>";
      formHtmlRequest("/broken_link", (page) => {
        expect(page).toBe(response);
        done();
      });
      interceptRequest("/broken_link").flush(response);
    });

    it("should handle api error", (done) => {
      formHtmlRequest("/broken_link", shouldNotSucceed, (err) => {
        expect(err?.status).toBe(500);
        done();
      });
      interceptRequest("/broken_link").flush(
        generateApiErrorResponse("Internal Server Error"),
        { status: 500, statusText: "Internal Server Error" }
      );
    });
  });

  describe("formDataRequest", () => {
    function interceptRequest(path: string) {
      return spec.expectOne(apiRoot + path, HttpMethod.POST);
    }

    function formDataRequest(
      path: string,
      formData: URLSearchParams = new URLSearchParams(),
      next: (value: string) => void = noop,
      error: (error: any) => void = noop
    ) {
      spec.service["formDataRequest"](path, formData).subscribe(next, error);
    }

    it("should create post request", () => {
      formDataRequest("/broken_link");
      expect(interceptRequest("/broken_link")).toBeInstanceOf(TestRequest);
    });

    it("should set responseType to text", () => {
      formDataRequest("/broken_link");
      const responseType = interceptRequest("/broken_link").request
        .responseType;
      expect(responseType).toBe("text");
    });

    it("should set accept header to text/html", () => {
      formDataRequest("/broken_link");
      const headers = interceptRequest("/broken_link").request.headers;
      expect(headers.get("Accept")).toBe("text/html");
    });

    it("should set content type header to form-urlencoded", () => {
      formDataRequest("/broken_link");
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
      formDataRequest("/broken_link", formData);
      const body = interceptRequest("/broken_link").request.body;
      expect(body).toBe(
        "user%5Blogin%5D=example+username&" +
          "user%5Bpassword%5D=Ex%40mp1e_P%4055w0rd%2B%3D"
      );
    });

    it("should handle api error", (done) => {
      formDataRequest("/broken_link", undefined, shouldNotSucceed, (err) => {
        expect(err?.status).toBe(500);
        done();
      });
      interceptRequest("/broken_link").flush(
        generateApiErrorResponse("Internal Server Error"),
        { status: 500, statusText: "Internal Server Error" }
      );
    });
  });

  describe("clearData", () => {
    beforeEach(() => {
      spec.service["clearSessionUser"] = jasmine
        .createSpy("clearSessionUser")
        .and.stub();
      spec.service["cookies"].deleteAll = jasmine
        .createSpy("deleteAll")
        .and.stub();
      spec.service.getAuthTrigger().next = jasmine.createSpy("next").and.stub();
    });

    it("should clear session user", () => {
      spec.service["clearData"]();
      expect(spec.service["clearSessionUser"]).toHaveBeenCalled();
    });

    it("should clear cookies", () => {
      spec.service["clearData"]();
      expect(spec.service["cookies"].deleteAll).toHaveBeenCalled();
    });

    it("should trigger authTrigger", () => {
      spec.service["clearData"]();
      expect(spec.service.getAuthTrigger().next).toHaveBeenCalledTimes(1);
    });
  });

  describe("signOut", () => {
    function createSuccess(path: string): void {
      spyOn(spec.service, "apiDestroy" as any).and.callFake(
        (destroyPath: string) => {
          expect(destroyPath).toBe(path);
          return new BehaviorSubject<void>(null);
        }
      );
    }

    function createError(url: string, error: ApiErrorDetails): void {
      spec.service["apiDestroy"] = jasmine
        .createSpy()
        .and.callFake((path: string) => {
          expect(path).toBe(url);
          const subject = new Subject();
          subject.error(error);
          return subject;
        });
    }

    it("should call apiDestroy", () => {
      createSuccess("/security/");
      spec.service.signOut().subscribe(noop, noop);
      expect(spec.service["apiDestroy"]).toHaveBeenCalledWith("/security/");
    });

    it("should handle response", (done) => {
      createSuccess("/security/");
      spec.service.signOut().subscribe(() => {
        ok(true);
        done();
      }, shouldNotFail);
    });

    it("should clear session user", () => {
      createSuccess("/security/");
      spec.service.signOut().subscribe(noop, shouldNotFail);
      expect(spec.service.getLocalUser()).toBeFalsy();
    });

    it("should trigger authTrigger", () => {
      const spy = jasmine.createSpy();
      createSuccess("/security/");

      spec.service
        .getAuthTrigger()
        .subscribe(spy, shouldNotFail, shouldNotComplete);
      spec.service.signOut().subscribe();

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should handle error", () => {
      createError("/security/", apiErrorDetails);
      spec.service.signOut().subscribe(shouldNotSucceed, (err) => {
        expect(err).toEqual(apiErrorDetails);
      });
    });

    it("should clear cookies", () => {
      spyOn(spec.service["cookies"], "deleteAll").and.stub();
      createError("/security/", apiErrorDetails);
      spec.service.signOut().subscribe(noop, noop);
      expect(spec.service["cookies"].deleteAll).toHaveBeenCalledTimes(1);
    });

    it("should trigger authTrigger on error", () => {
      const spy = jasmine.createSpy();
      createError("/security/", apiErrorDetails);

      spec.service
        .getAuthTrigger()
        .subscribe(spy, shouldNotFail, shouldNotComplete);
      spec.service.signOut().subscribe(noop, noop);

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
