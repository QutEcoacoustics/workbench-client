import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import { unknownErrorCode } from "@baw-api/baw-api.service";
import { MockShowApiService } from "@baw-api/mock/apiMocks.service";
import { SessionUser, User } from "@models/User";
import { createHttpFactory, SpectatorHttp } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateLoginDetails } from "@test/fakes/LoginDetails";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { assertOk, getCallArgs, nStepObservable } from "@test/helpers/general";
import { BehaviorSubject, noop, Subject } from "rxjs";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import {
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "../baw-api.service.spec";
import { UserService } from "../user/user.service";
import { SecurityService } from "./security.service";

describe("SecurityService", () => {
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

  beforeEach(() => {
    localStorage.clear();

    spec = createService();
    userApi = spec.inject(UserService);

    const userData = generateUser();
    defaultAuthToken = modelData.random.alphaNumeric(20);
    defaultError = generateApiErrorDetails();
    defaultUser = new User(userData);
    defaultSessionUser = new SessionUser({
      ...userData,
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
    it("should call getRecaptchaSeed", () => {
      spec.service["getRecaptchaSeed"] = jasmine
        .createSpy("getRecaptchaSeed")
        .and.callFake(() => new Subject());

      spec.service.signUpSeed().subscribe(noop, noop);
      expect(spec.service["getRecaptchaSeed"]).toHaveBeenCalledWith(
        "/my_account/sign_up/"
      );
    });
  });

  describe("authentication methods", () => {
    let handleAuthSpy: jasmine.Spy;

    function getFormData(token: string): string {
      return getCallArgs(handleAuthSpy)[2](token).toString();
    }

    beforeEach(() => {
      handleAuthSpy = jasmine.createSpy("handleAuth");
      spec.service["handleAuth"] = handleAuthSpy.and.stub();
    });

    describe("signIn", () => {
      function interceptSignOut(success?: boolean) {
        const subject = new Subject();
        spec.service.signOut = jasmine.createSpy().and.callFake(() => subject);
        return nStepObservable(
          subject,
          () => (success ? null : generateApiErrorDetails()),
          !success
        );
      }

      it("should call signOut", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaultLoginDetails);
        await promise;
        expect(spec.service.signOut).toHaveBeenCalled();
      });

      it("should handle signOut failure", async () => {
        const promise = interceptSignOut(false);
        spec.service.signIn(defaultLoginDetails);
        await promise;
        expect(spec.service.signOut).toHaveBeenCalled();
      });

      it("should call handleAuth", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaultLoginDetails);
        await promise;
        expect(handleAuthSpy).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaultLoginDetails);
        await promise;
        expect(getCallArgs(handleAuthSpy)[0]).toBe("/my_account/sign_in/");
      });

      it("should call handleAuth with correct auth endpoint", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaultLoginDetails);
        await promise;
        expect(getCallArgs(handleAuthSpy)[1]).toBe("/my_account/sign_in/");
      });

      it("should set request body", async () => {
        const loginDetails = new LoginDetails({
          login: "sign_in details",
          password: "sign_in password",
        });
        const expectation =
          "user%5Blogin%5D=sign_in+details&" +
          "user%5Bpassword%5D=sign_in+password&" +
          "user%5Bremember_me%5D=0&" +
          "commit=Log%2Bin&" +
          `authenticity_token=${defaultAuthToken}`;

        const promise = interceptSignOut(true);
        spec.service.signIn(loginDetails);
        await promise;
        expect(getFormData(defaultAuthToken)).toBe(expectation);
      });
    });

    describe("signUp", () => {
      it("should call handleAuth", () => {
        spec.service.signUp(defaultRegisterDetails);
        expect(handleAuthSpy).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", () => {
        spec.service.signUp(defaultRegisterDetails);
        expect(getCallArgs(handleAuthSpy)[0]).toBe("/my_account/sign_up/");
      });

      it("should call handleAuth with correct auth endpoint", () => {
        spec.service.signUp(defaultRegisterDetails);
        expect(getCallArgs(handleAuthSpy)[1]).toBe("/my_account/");
      });

      it("should set request body", () => {
        const registerDetails = new RegisterDetails({
          email: "sign_up@email.com",
          userName: "sign_up details",
          password: "sign_up password",
          passwordConfirmation: "sign_up password",
          recaptchaToken: "xxxxxxxxxx",
        });
        const expectation =
          "user%5Buser_name%5D=sign_up+details&" +
          "user%5Bemail%5D=sign_up%40email.com&" +
          "user%5Bpassword%5D=sign_up+password&" +
          "user%5Bpassword_confirmation%5D=sign_up+password&" +
          "commit=Register&" +
          `authenticity_token=${defaultAuthToken}&` +
          "g-recaptcha-response-data%5Bregister%5D=xxxxxxxxxx&" +
          "g-recaptcha-response=";

        spec.service.signUp(registerDetails);
        expect(getFormData(defaultAuthToken)).toBe(expectation);
      });

      it("should throw error if username is not unique", () => {
        const response =
          '<input id="user_user_name" />' +
          '<span class="help-block">has already been taken</span>';

        spec.service.signUp(defaultRegisterDetails);
        expect(function () {
          getCallArgs(handleAuthSpy)[3](response);
        }).toThrowError("Username has already been taken.");
      });

      it("should throw error if email is not unique", () => {
        const response =
          '<input id="user_email" />' +
          '<span class="help-block">has already been taken</span>';

        spec.service.signUp(defaultRegisterDetails);
        expect(function () {
          getCallArgs(handleAuthSpy)[3](response);
        }).toThrowError("Email address has already been taken.");
      });

      it("should throw error if no recaptcha token", () => {
        const registerDetails = new RegisterDetails(
          generateRegisterDetails({ recaptchaToken: null })
        );
        const page = `<input name="authenticity_token" value="${defaultAuthToken}"></input>`;

        spec.service.signUp(registerDetails);
        expect(function () {
          getFormData(page);
        }).toThrowError();
      });
    });
  });

  describe("handleAuth", () => {
    let makeFormRequestSpy: jasmine.Spy;
    let sessionUserSpy: jasmine.Spy;
    let userSpy: jasmine.Spy;

    function handleAuth(inputs?: {
      formEndpoint?: string;
      authEndpoint?: string;
      getFormData?: (page: string) => URLSearchParams;
      pageValidation?: (page: string) => void;
    }) {
      return spec.service["handleAuth"](
        inputs?.formEndpoint ?? "/broken_link",
        inputs?.authEndpoint ?? "/broken_link",
        inputs?.getFormData ?? (() => new URLSearchParams()),
        inputs?.pageValidation ?? (() => {})
      );
    }

    function interceptSessionUser(model: SessionUser, error?: ApiErrorDetails) {
      sessionUserSpy = jasmine.createSpy("apiShow");
      spec.service["apiShow"] = sessionUserSpy;
      return intercept(sessionUserSpy, model, error);
    }

    function interceptUser(model: User, error?: ApiErrorDetails) {
      userSpy = spyOn(userApi, "show");
      return intercept(userSpy, model, error);
    }

    function interceptMakeFormRequest(error?: ApiErrorDetails) {
      makeFormRequestSpy = jasmine.createSpy("makeFormRequest");
      spec.service["makeFormRequest"] = makeFormRequestSpy;
      return intercept(
        makeFormRequestSpy,
        !error ? "<html></html>" : undefined,
        error
      );
    }

    describe("1st Request: makeFormRequest", () => {
      it("should call makeFormRequest", () => {
        interceptMakeFormRequest();
        handleAuth().subscribe(noop, noop);
        expect(makeFormRequestSpy).toHaveBeenCalled();
      });

      it("should call makeFormRequest with formEndpoint", () => {
        interceptMakeFormRequest();
        handleAuth({ formEndpoint: "/form_html_link" }).subscribe(noop, noop);
        expect(getCallArgs(makeFormRequestSpy)[0]).toBe("/form_html_link");
      });

      it("should call makeFormRequest with authEndpoint", () => {
        interceptMakeFormRequest();
        handleAuth({ authEndpoint: "/auth_html_link" }).subscribe(noop, noop);
        expect(getCallArgs(makeFormRequestSpy)[1]).toBe("/auth_html_link");
      });

      it("should call makeFormRequest with getFormData", () => {
        const formData = () => new URLSearchParams();
        interceptMakeFormRequest();
        handleAuth({ getFormData: formData }).subscribe(noop, noop);
        expect(getCallArgs(makeFormRequestSpy)[2]).toBe(formData);
      });

      it("should perform additional page validation", (done) => {
        interceptMakeFormRequest();
        handleAuth({
          pageValidation: () => {
            throw Error("custom error");
          },
        }).subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual({
            status: unknownErrorCode,
            message: "custom error",
          } as ApiErrorDetails);
          done();
        });
      });

      it("should handle makeFormRequest failure", (done) => {
        interceptMakeFormRequest(defaultError);
        handleAuth().subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual(defaultError);
          done();
        });
      });
    });

    describe("2nd Request: Get session user", () => {
      let initialSteps: Promise<any>;

      beforeEach(() => {
        initialSteps = interceptMakeFormRequest();
      });

      it("should request session user details", async () => {
        interceptSessionUser(defaultSessionUser);
        handleAuth().subscribe(noop, noop);
        await initialSteps;
        expect(sessionUserSpy).toHaveBeenCalled();
      });

      it("should request session user details with anti cache timestamp", async () => {
        interceptSessionUser(defaultSessionUser);
        handleAuth().subscribe(noop, noop);
        await initialSteps;

        // Validate timestamp within 1000 ms
        const timestamp = Math.floor(Date.now() / 1000);
        expect(getCallArgs(sessionUserSpy)[0]).toContain(
          "/security/user?antiCache=" + timestamp
        );
      });

      it("should handle session user details failure", (done) => {
        interceptSessionUser(undefined, defaultError);
        handleAuth().subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual(defaultError);
          done();
        });
      });
    });

    describe("3rd Request: Get user", () => {
      let initialSteps: Promise<any>;

      beforeEach(() => {
        initialSteps = Promise.all([
          interceptMakeFormRequest(),
          interceptSessionUser(defaultSessionUser),
        ]);
      });

      it("should request user details", async () => {
        interceptUser(defaultUser);
        handleAuth().subscribe(noop, noop);
        await initialSteps;
        expect(userSpy).toHaveBeenCalled();
      });

      it("should handle user details failure", (done) => {
        interceptUser(undefined, defaultError);
        handleAuth().subscribe(shouldNotSucceed, (err) => {
          expect(err).toEqual(defaultError);
          done();
        });
      });
    });

    describe("success", () => {
      async function initialSteps() {
        return Promise.all([
          interceptMakeFormRequest(),
          interceptSessionUser(defaultSessionUser),
          interceptUser(defaultUser),
        ]);
      }

      it("should store session user in local storage", async () => {
        const promise = initialSteps();
        handleAuth().subscribe(noop, noop);
        await promise;
        expect(spec.service.getLocalUser()).toEqual(
          new SessionUser({
            ...defaultSessionUser.getJsonAttributes(),
            ...defaultUser.getJsonAttributes(),
          })
        );
      });

      it("should trigger authTrigger", async () => {
        const trigger = spec.service.getAuthTrigger();
        trigger.subscribe(noop, noop, shouldNotComplete);
        spyOn(trigger, "next").and.callThrough();
        expect(trigger.next).toHaveBeenCalledTimes(0);
        const promise = initialSteps();
        handleAuth().subscribe(noop, noop);
        await promise;
        expect(trigger.next).toHaveBeenCalledTimes(1);
      });

      it("should call next", (done) => {
        initialSteps();
        handleAuth().subscribe(() => {
          expect(true).toBeTrue();
          done();
        }, shouldNotFail);
      });

      it("should complete observable", (done) => {
        initialSteps();
        handleAuth().subscribe(noop, shouldNotFail, () => {
          expect(true).toBeTrue();
          done();
        });
      });
    });

    describe("error", () => {
      it("should call clearData", async () => {
        spec.service["clearData"] = jasmine.createSpy("clearData").and.stub();
        spec.service["storeLocalUser"](defaultSessionUser);
        const promise = interceptMakeFormRequest(defaultError);
        handleAuth().subscribe(noop, noop);
        await promise;
        expect(spec.service["clearData"]).toHaveBeenCalled();
      });
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
        assertOk();
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
      const error = generateApiErrorDetails();
      createError("/security/", error);
      spec.service.signOut().subscribe(shouldNotSucceed, (err) => {
        expect(err).toEqual(error);
      });
    });

    it("should clear cookies", () => {
      spyOn(spec.service["cookies"], "deleteAll").and.stub();
      createError("/security/", generateApiErrorDetails());
      spec.service.signOut().subscribe(noop, noop);
      expect(spec.service["cookies"].deleteAll).toHaveBeenCalledTimes(1);
    });

    it("should trigger authTrigger on error", () => {
      const spy = jasmine.createSpy();
      createError("/security/", generateApiErrorDetails());

      spec.service
        .getAuthTrigger()
        .subscribe(spy, shouldNotFail, shouldNotComplete);
      spec.service.signOut().subscribe(noop, noop);

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
