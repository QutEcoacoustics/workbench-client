import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BawApiInterceptor } from "@baw-api/api.interceptor.service";
import { BawApiService, unknownErrorCode } from "@baw-api/baw-api.service";
import {
  BawFormApiService,
  RecaptchaSettings,
} from "@baw-api/baw-form-api.service";
import {
  AuthTriggerData,
  BawSessionService,
} from "@baw-api/baw-session.service";
import { Errorable } from "@helpers/advancedTypes";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AuthToken } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { Session, User } from "@models/User";
import {
  createHttpFactory,
  mockProvider,
  SpectatorHttp,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateLoginDetails } from "@test/fakes/LoginDetails";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { generateSession, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { assertOk, getCallArgs, nStepObservable } from "@test/helpers/general";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { noop, Subject, throwError } from "rxjs";
import {
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "../baw-api.service.spec";
import { UserService } from "../user/user.service";
import { SecurityService } from "./security.service";

describe("SecurityService", () => {
  let defaults: {
    user: User;
    session: Session;
    authToken: AuthToken;
    registerDetails: RegisterDetails;
    loginDetails: LoginDetails;
    error: BawApiError;
  };
  let subjects: {
    apiShow: Subject<AbstractModel>;
    apiDestroy: Subject<null>;
    getRecaptchaSeed: Subject<RecaptchaSettings>;
    makeFormRequest: Subject<string>;
    userShow: Subject<User>;
  };
  let session: BawSessionService;
  let userApi: UserService;
  let formApi: BawFormApiService<Session>;
  let cookies: CookieService;
  let api: BawApiService<Session>;
  let spec: SpectatorHttp<SecurityService>;
  const createService = createHttpFactory({
    service: SecurityService,
    imports: [MockAppConfigModule],
    providers: [
      BawSessionService,
      CookieService,
      mockProvider(ToastrService),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
    ],
  });

  function triggerApiShow(model: Errorable<AbstractModel>) {
    return nStepObservable(subjects.apiShow, () => model, isBawApiError(model));
  }

  function triggerApiDestroy(error?: BawApiError) {
    return nStepObservable(
      subjects.apiDestroy,
      () => error ?? null,
      isInstantiated(error)
    );
  }

  function triggerMakeFormRequest(page: Errorable<string>) {
    return nStepObservable(
      subjects.makeFormRequest,
      () => page,
      isBawApiError(page)
    );
  }

  function triggerUserShow(model: Errorable<User>) {
    return nStepObservable(
      subjects.userShow,
      () => model,
      isBawApiError(model)
    );
  }

  async function handleAuthTokenRetrievalDuringInitialization() {
    await triggerApiShow(defaults.session);
    await triggerUserShow(defaults.user);
    session.clearLoggedInUser();
  }

  beforeEach(() => {
    subjects = {
      apiShow: new Subject(),
      apiDestroy: new Subject(),
      getRecaptchaSeed: new Subject(),
      makeFormRequest: new Subject(),
      userShow: new Subject(),
    };

    spec = createService({
      providers: [
        mockProvider(BawApiService, {
          show: jasmine.createSpy("show").and.callFake(() => subjects.apiShow),
          destroy: jasmine
            .createSpy("destroy")
            .and.callFake(() => subjects.apiDestroy),
        }),
        mockProvider(BawFormApiService, {
          getRecaptchaSeed: jasmine
            .createSpy("getRecaptchaSeed")
            .and.callFake(() => subjects.getRecaptchaSeed),
          makeFormRequest: jasmine
            .createSpy("makeFormRequest")
            .and.callFake(() => subjects.makeFormRequest),
          // TODO Would prefer this to actually use the real service
          handleError: jasmine.createSpy("handleError").and.callFake((err) => {
            const error = isBawApiError(err)
              ? err
              : new BawApiError(unknownErrorCode, err.message);
            return throwError(() => error);
          }),
        }),
        mockProvider(UserService, {
          show: jasmine.createSpy("show").and.callFake(() => subjects.userShow),
        }),
      ],
    });
    api = spec.inject<BawApiService<Session>>(BawApiService);
    formApi = spec.inject<BawFormApiService<Session>>(BawFormApiService);
    session = spec.inject(BawSessionService);
    userApi = spec.inject(UserService);
    cookies = spec.inject(CookieService);

    const authToken = modelData.authToken();
    defaults = {
      authToken,
      user: new User(generateUser()),
      session: new Session(generateSession({ authToken })),
      loginDetails: new LoginDetails(generateLoginDetails()),
      registerDetails: new RegisterDetails(generateRegisterDetails()),
      error: generateBawApiError(),
    };
  });

  describe("signUpSeed", () => {
    it("should call getRecaptchaSeed", async () => {
      await handleAuthTokenRetrievalDuringInitialization();
      spec.service.signUpSeed().subscribe({ next: noop, error: noop });
      expect(formApi.getRecaptchaSeed).toHaveBeenCalledWith(
        "/my_account/sign_up"
      );
    });
  });

  describe("authentication methods", () => {
    let handleAuthSpy: jasmine.Spy;

    function getFormData(token: string): string {
      return getCallArgs(handleAuthSpy)[2](token).toString();
    }

    beforeEach(async () => {
      await handleAuthTokenRetrievalDuringInitialization();
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
        spec.service.signIn(defaults.loginDetails);
        await promise;
        expect(spec.service.signOut).toHaveBeenCalled();
      });

      it("should handle signOut failure", async () => {
        const promise = interceptSignOut(false);
        spec.service.signIn(defaults.loginDetails);
        await promise;
        expect(spec.service.signOut).toHaveBeenCalled();
      });

      it("should call handleAuth", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaults.loginDetails);
        await promise;
        expect(handleAuthSpy).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaults.loginDetails);
        await promise;
        expect(getCallArgs(handleAuthSpy)[0]).toBe("/my_account/sign_in");
      });

      it("should call handleAuth with correct auth endpoint", async () => {
        const promise = interceptSignOut(true);
        spec.service.signIn(defaults.loginDetails);
        await promise;
        expect(getCallArgs(handleAuthSpy)[1]).toBe("/my_account/sign_in");
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
          `authenticity_token=${defaults.authToken}`;

        const promise = interceptSignOut(true);
        spec.service.signIn(loginDetails);
        await promise;
        expect(getFormData(defaults.authToken)).toBe(expectation);
      });
    });

    describe("signUp", () => {
      it("should call handleAuth", () => {
        spec.service.signUp(defaults.registerDetails);
        expect(handleAuthSpy).toHaveBeenCalled();
      });

      it("should call handleAuth with correct form endpoint", () => {
        spec.service.signUp(defaults.registerDetails);
        expect(getCallArgs(handleAuthSpy)[0]).toBe("/my_account/sign_up");
      });

      it("should call handleAuth with correct auth endpoint", () => {
        spec.service.signUp(defaults.registerDetails);
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
          `authenticity_token=${defaults.authToken}&` +
          "g-recaptcha-response-data%5Bregister%5D=xxxxxxxxxx&" +
          "g-recaptcha-response=";

        spec.service.signUp(registerDetails);
        expect(getFormData(defaults.authToken)).toBe(expectation);
      });

      it("should throw error if username is not unique", () => {
        const response =
          '<input id="user_user_name" />' +
          '<span class="help-block">has already been taken</span>';

        spec.service.signUp(defaults.registerDetails);
        expect(function () {
          getCallArgs(handleAuthSpy)[3](response);
        }).toThrowError("Username has already been taken.");
      });

      it("should throw error if email is not unique", () => {
        const response =
          '<input id="user_email" />' +
          '<span class="help-block">has already been taken</span>';

        spec.service.signUp(defaults.registerDetails);
        expect(function () {
          getCallArgs(handleAuthSpy)[3](response);
        }).toThrowError("Email address has already been taken.");
      });

      it("should throw error if no recaptcha token", () => {
        const registerDetails = new RegisterDetails(
          generateRegisterDetails({ recaptchaToken: null })
        );
        const page = `<input name="authenticity_token" value="${defaults.authToken}"></input>`;

        spec.service.signUp(registerDetails);
        expect(function () {
          getFormData(page);
        }).toThrowError();
      });
    });
  });

  describe("handleAuth", () => {
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

    function interceptSession(model: Errorable<Session>) {
      return triggerApiShow(model);
    }

    function interceptUser(model: Errorable<User>) {
      return triggerUserShow(model);
    }

    function interceptMakeFormRequest(
      page: Errorable<string> = "<html></html>"
    ) {
      return triggerMakeFormRequest(page);
    }

    function getMakeFormRequestCallArgs() {
      return getCallArgs(formApi.makeFormRequest as jasmine.Spy);
    }

    beforeEach(async () => {
      await handleAuthTokenRetrievalDuringInitialization();
    });

    describe("1st Request: makeFormRequest", () => {
      it("should call makeFormRequest", () => {
        interceptMakeFormRequest();
        handleAuth().subscribe({ next: noop, error: noop });
        expect(formApi.makeFormRequest).toHaveBeenCalled();
      });

      it("should call makeFormRequest with formEndpoint", () => {
        interceptMakeFormRequest();
        handleAuth({ formEndpoint: "/form_html_link" }).subscribe({
          next: noop,
          error: noop,
        });
        expect(getMakeFormRequestCallArgs()[0]).toBe("/form_html_link");
      });

      it("should call makeFormRequest with authEndpoint", () => {
        interceptMakeFormRequest();
        handleAuth({ authEndpoint: "/auth_html_link" }).subscribe({
          next: noop,
          error: noop,
        });
        expect(getMakeFormRequestCallArgs()[1]).toBe("/auth_html_link");
      });

      it("should call makeFormRequest with getFormData", () => {
        const formData = () => new URLSearchParams();
        interceptMakeFormRequest();
        handleAuth({ getFormData: formData }).subscribe({
          next: noop,
          error: noop,
        });
        expect(getMakeFormRequestCallArgs()[2]).toBe(formData);
      });

      it("should perform additional page validation", (done) => {
        interceptMakeFormRequest();
        handleAuth({
          pageValidation: () => {
            throw Error("custom error");
          },
        }).subscribe({
          next: shouldNotSucceed,
          error: (err) => {
            expect(err).toEqual(
              new BawApiError(unknownErrorCode, "custom error")
            );
            done();
          },
        });
      });

      it("should handle makeFormRequest failure", (done) => {
        interceptMakeFormRequest(defaults.error);
        handleAuth().subscribe({
          next: shouldNotSucceed,
          error: (err) => {
            expect(err).toEqual(defaults.error);
            done();
          },
        });
      });
    });

    describe("2nd Request: Get session user", () => {
      let initialSteps: Promise<any>;

      function getSessionDetailsArgs() {
        return getCallArgs(api.show as jasmine.Spy);
      }

      beforeEach(() => {
        initialSteps = interceptMakeFormRequest();
      });

      it("should request session user details", async () => {
        interceptSession(defaults.session);
        handleAuth().subscribe({ next: noop, error: noop });
        await initialSteps;
        expect(api.show).toHaveBeenCalled();
      });

      it("should request session user details with anti cache timestamp", async () => {
        interceptSession(defaults.session);
        handleAuth().subscribe({ next: noop, error: noop });
        await initialSteps;

        // Validate timestamp within 1000 ms
        const timestamp = Math.floor(Date.now() / 1000);
        const args = getSessionDetailsArgs();
        expect(args[0]).toEqual(Session);
        expect(args[1]).toContain("/security/user?antiCache=" + timestamp);
      });

      it("should handle session user details failure", (done) => {
        interceptSession(defaults.error);
        handleAuth().subscribe({
          next: shouldNotSucceed,
          error: (err) => {
            expect(err).toEqual(defaults.error);
            done();
          },
        });
      });
    });

    describe("3rd Request: Get user", () => {
      let initialSteps: Promise<any>;

      beforeEach(() => {
        initialSteps = Promise.all([
          interceptMakeFormRequest(),
          interceptSession(defaults.session),
        ]);
      });

      it("should request user details", async () => {
        interceptUser(defaults.user);
        handleAuth().subscribe({ next: noop, error: noop });
        await initialSteps;
        expect(userApi.show).toHaveBeenCalled();
      });

      it("should handle user details failure", (done) => {
        interceptUser(defaults.error);
        handleAuth().subscribe({
          next: shouldNotSucceed,
          error: (err) => {
            expect(err).toEqual(defaults.error);
            done();
          },
        });
      });
    });

    describe("success", () => {
      async function initialSteps() {
        return Promise.all([
          interceptMakeFormRequest(),
          interceptSession(defaults.session),
          interceptUser(defaults.user),
        ]);
      }

      it("should store session user", (done) => {
        initialSteps();
        handleAuth().subscribe({
          error: shouldNotFail,
          complete: () => {
            expect(session.loggedInUser).toEqual(defaults.user);
            done();
          },
        });
      });

      it("should trigger authTrigger", async () => {
        const trigger = session.authTrigger as Subject<AuthTriggerData>;
        trigger.subscribe({ complete: shouldNotComplete });
        spyOn(trigger, "next").and.callThrough();
        expect(trigger.next).toHaveBeenCalledTimes(0);
        const promise = initialSteps();
        handleAuth().subscribe({ next: noop, error: noop });
        await promise;
        expect(trigger.next).toHaveBeenCalledTimes(1);
      });

      it("should call next", (done) => {
        initialSteps();
        handleAuth().subscribe({
          next: () => {
            assertOk();
            done();
          },
          error: shouldNotFail,
        });
      });

      it("should complete observable", (done) => {
        initialSteps();
        handleAuth().subscribe({
          error: shouldNotFail,
          complete: () => {
            assertOk();
            done();
          },
        });
      });
    });

    describe("error", () => {
      it("should call clearData", async () => {
        spec.service["clearData"] = jasmine.createSpy("clearData").and.stub();
        session.setLoggedInUser(defaults.user, defaults.authToken);
        const promise = interceptMakeFormRequest(defaults.error);
        handleAuth().subscribe({ next: noop, error: noop });
        await promise;
        expect(spec.service["clearData"]).toHaveBeenCalled();
      });
    });
  });

  describe("clearData", () => {
    beforeEach(async () => {
      await handleAuthTokenRetrievalDuringInitialization();
      spyOn(session, "clearLoggedInUser").and.callThrough();
      spyOn(session.authTrigger as Subject<AuthTriggerData>, "next").and.stub();
    });

    it("should clear session user", () => {
      spec.service["clearData"]();
      expect(session.clearLoggedInUser).toHaveBeenCalled();
    });

    it("should trigger authTrigger", () => {
      spec.service["clearData"]();
      expect(
        (session.authTrigger as Subject<AuthTriggerData>).next
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("signOut", () => {
    beforeEach(async () => {
      await handleAuthTokenRetrievalDuringInitialization();
    });

    it("should call destroy", async () => {
      spec.service.signOut().subscribe({ next: noop, error: noop });
      await triggerApiDestroy();
      expect(api.destroy).toHaveBeenCalledWith("/security/");
    });

    it("should handle response", (done) => {
      spec.service.signOut().subscribe({
        next: () => {
          assertOk();
          done();
        },
        error: shouldNotFail,
      });
      triggerApiDestroy();
    });

    it("should clear session user on success", async () => {
      spec.service.signOut().subscribe({
        error: shouldNotFail,
      });
      await triggerApiDestroy();
      subjects.apiDestroy.complete();
      expect(session.loggedInUser).toBeFalsy();
    });

    it("should handle error", (done) => {
      const error = generateBawApiError();
      spec.service.signOut().subscribe({
        next: shouldNotSucceed,
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
      triggerApiDestroy(error);
    });

    it("should clear cookies on error", async () => {
      spyOn(cookies, "deleteAll").and.stub();
      expect(cookies.deleteAll).toHaveBeenCalledTimes(0);
      spec.service.signOut().subscribe({ error: noop });
      await triggerApiDestroy(defaults.error);
      expect(cookies.deleteAll).toHaveBeenCalledTimes(1);
    });
  });
});
