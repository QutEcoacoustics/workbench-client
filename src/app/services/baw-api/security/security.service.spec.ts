import { ok } from "assert";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import { MockShowApiService } from "@baw-api/mock/apiMocks.service";
import { Option } from "@helpers/advancedTypes";
import { SessionUser, User } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { BehaviorSubject, noop, Subject } from "rxjs";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "../baw-api.service.spec";
import { UserService } from "../user/user.service";
import { LoginDetails, SecurityService } from "./security.service";

describe("SecurityService", () => {
  let apiRoot: string;
  let defaultUser: User;
  let defaultSessionUser: SessionUser;
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
    defaultLoginDetails = new LoginDetails({
      login: modelData.internet.userName(),
      password: modelData.internet.password(),
    });
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

  describe("signIn", () => {
    function expectLoginFormRequest() {
      return spec.expectOne(apiRoot + "/my_account/sign_in/", HttpMethod.GET);
    }

    function expectCookieRequest() {
      return spec.expectOne(apiRoot + "/my_account/sign_in/", HttpMethod.POST);
    }

    function intercept(
      req: TestRequest,
      success: boolean,
      response: Option<any>,
      expectation: Option<(req: TestRequest) => void>
    ) {
      if (success) {
        req.flush(response);
        expectation?.(req);
      } else {
        req.flush(
          { meta: { ...defaultError } },
          {
            status: defaultError.status,
            statusText: defaultError.message,
          }
        );
      }
      return req;
    }

    function handleLoginForm(
      authenticityToken: string,
      expectation?: (req: TestRequest) => void
    ) {
      intercept(
        expectLoginFormRequest(),
        !!authenticityToken,
        `<input name="authenticity_token" value="${authenticityToken}" />`,
        expectation
      );
    }

    function handleCookie(
      success: boolean,
      expectation?: (req: TestRequest) => void
    ) {
      intercept(expectCookieRequest(), success, "<html></html>", expectation);
    }

    function interceptSessionUser(user: SessionUser, error?: ApiErrorDetails) {
      const subject = new BehaviorSubject(user);
      if (!user) {
        subject.error(error);
      }
      spec.service["apiShow"] = jasmine.createSpy().and.callFake(() => subject);
    }

    function interceptUser(user: User, error?: ApiErrorDetails) {
      const subject = new BehaviorSubject(user);
      if (!user) {
        subject.error(error);
      }
      spyOn(userApi, "show").and.callFake(() => subject);
    }

    describe("1st request: Login form", () => {
      beforeEach(() => {
        interceptSessionUser(defaultSessionUser);
        interceptUser(defaultUser);
      });

      it("should request login form", (done) => {
        spec.service.signIn(defaultLoginDetails).subscribe(noop, shouldNotFail);

        handleLoginForm(defaultAuthToken, (req) => {
          expect(req.request.responseType).toBe("text");
          expect(req.request.headers.get("Accept")).not.toBe(
            "application/json"
          );
          expect(req.request.headers.get("Content-Type")).not.toBe(
            "application/json"
          );
          expectCookieRequest();
          done();
        });
      });

      it("should handle login form failure", (done) => {
        spec.service
          .signIn(defaultLoginDetails)
          .subscribe(shouldNotSucceed, (details) => {
            expect(details).toBeTruthy();
            done();
          });

        handleLoginForm(undefined);
      });
    });

    describe("2nd request: Authentication cookies", () => {
      beforeEach(() => {
        interceptSessionUser(defaultSessionUser);
        interceptUser(defaultUser);
      });

      it("should request api cookie", (done) => {
        spec.service.signIn(defaultLoginDetails).subscribe(noop, shouldNotFail);

        handleLoginForm(defaultAuthToken);
        handleCookie(true, (req) => {
          expect(req.request.responseType).toBe("text");
          expect(req.request.headers.get("Accept")).toBe("text/html");
          expect(req.request.headers.get("Content-Type")).toBe(
            "application/x-www-form-urlencoded"
          );
          done();
        });
      });

      it("should request api cookie with login details", (done) => {
        const details = new LoginDetails({
          login: "test username",
          password: "Ex@mp1e_P@55w0rd",
        });
        const authToken = "5efm2plggqiuvyjlghgp";
        spec.service.signIn(details).subscribe(noop, shouldNotFail);

        handleLoginForm(authToken);
        handleCookie(true, (req) => {
          expect(req.request.body).toBe(
            "user%5Blogin%5D=test+username&" +
              "user%5Bpassword%5D=Ex%40mp1e_P%4055w0rd&" +
              "user%5Bremember_me%5D=0&" +
              "commit=Log%2Bin&" +
              "authenticity_token=5efm2plggqiuvyjlghgp"
          );
          done();
        });
      });

      it("should handle api cookie failure", (done) => {
        spec.service
          .signIn(defaultLoginDetails)
          .subscribe(shouldNotSucceed, (details) => {
            expect(details).toBeTruthy();
            done();
          });

        handleLoginForm(defaultAuthToken);
        handleCookie(false);
      });
    });

    describe("3rd request: Session User details", () => {
      beforeEach(() => {
        interceptUser(defaultUser);
      });

      it("should request session user details", () => {
        interceptSessionUser(defaultSessionUser);
        spec.service.signIn(defaultLoginDetails).subscribe(noop, shouldNotFail);
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
        expect(spec.service["apiShow"]).toHaveBeenCalledTimes(1);
      });

      it("should request session user details with anti cache containing current timestamp", () => {
        interceptSessionUser(defaultSessionUser);
        spec.service.signIn(defaultLoginDetails).subscribe(noop, shouldNotFail);
        handleLoginForm(defaultAuthToken);
        handleCookie(true);

        // Validate timestamp within 1000 ms
        const timestamp = Math.floor(Date.now() / 1000);
        expect(
          (spec.service["apiShow"] as jasmine.Spy).calls.mostRecent().args[0]
        ).toContain("/security/user?antiCache=" + timestamp);
      });

      it("should handle user details failure", (done) => {
        interceptSessionUser(undefined, defaultError);
        spec.service
          .signIn(defaultLoginDetails)
          .subscribe(shouldNotSucceed, (details) => {
            expect(details).toBeTruthy();
            done();
          });
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
      });
    });

    describe("4th request: User details", () => {
      beforeEach(() => {
        interceptSessionUser(defaultSessionUser);
      });

      it("should request user details", () => {
        interceptUser(defaultUser);
        spec.service.signIn(defaultLoginDetails).subscribe(noop, shouldNotFail);
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
        expect(userApi.show).toHaveBeenCalledTimes(1);
      });

      it("should handle user details failure", (done) => {
        interceptUser(undefined, defaultError);
        spec.service
          .signIn(defaultLoginDetails)
          .subscribe(shouldNotSucceed, (details) => {
            expect(details).toBeTruthy();
            done();
          });
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
      });
    });

    describe("success", () => {
      function successfulRequest() {
        interceptSessionUser(defaultSessionUser);
        interceptUser(defaultUser);
        spec.service.signIn(defaultLoginDetails).subscribe(noop, noop);
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
      }

      it("should store session user in local storage", () => {
        successfulRequest();
        expect(spec.service.getLocalUser()).toEqual(
          new SessionUser({
            ...defaultSessionUser.toJSON(),
            ...defaultUser.toJSON(),
          })
        );
      });
      it("should trigger authTrigger", () => {
        const trigger = spec.service.getAuthTrigger();
        trigger.subscribe(noop, noop, shouldNotComplete);
        spyOn(trigger, "next").and.callThrough();
        expect(trigger.next).toHaveBeenCalledTimes(0);
        successfulRequest();
        expect(trigger.next).toHaveBeenCalledTimes(1);
      });
    });

    describe("error", () => {
      function errorRequest() {
        interceptSessionUser(undefined, defaultError);
        interceptUser(defaultUser);
        spec.service.signIn(defaultLoginDetails).subscribe(noop, noop);
        handleLoginForm(defaultAuthToken);
        handleCookie(true);
      }

      it("should clear session user", () => {
        spec.service["storeLocalUser"](defaultSessionUser);
        errorRequest();
        expect(spec.service.getLocalUser()).toBeFalsy();
      });

      it("should trigger authTrigger", () => {
        const trigger = spec.service.getAuthTrigger();
        trigger.subscribe(noop, noop, shouldNotComplete);
        spyOn(trigger, "next").and.callThrough();
        expect(trigger.next).toHaveBeenCalledTimes(0);
        errorRequest();
        expect(trigger.next).toHaveBeenCalledTimes(1);
      });
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
