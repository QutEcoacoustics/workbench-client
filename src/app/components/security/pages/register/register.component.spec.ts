import { ActivatedRoute, Router } from "@angular/router";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { AccountsService } from "@baw-api/account/accounts.service";
import { RecaptchaSettings } from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { UserConcent } from "@interfaces/apiInterfaces";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { AuthRedirectService } from "@services/security/auth-redirect.service";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { modelData } from "@test/helpers/faker";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { of, Subject } from "rxjs";
import { RegisterComponent } from "./register.component";
import schema from "./register.schema.json";

describe("RegisterComponent", () => {
  const { fields } = schema;
  let spec: Spectator<RegisterComponent>;

  let api: SecurityService;
  let session: BawSessionService;
  let notifications: ToastService;
  let accounts: AccountsService;

  const createComponent = createComponentFactory({
    component: RegisterComponent,
    imports: [...testFormImports, FormComponent],
    providers: testFormProviders,
  });

  function isSignedIn(signedIn = true) {
    spyOnProperty(session, "isLoggedIn").and.returnValue(signedIn);
  }

  function mockSignUp(isFailure: boolean): Promise<void> {
    const subject = new Subject<any>();

    const mockResponse = isFailure ? generateBawApiError() : of();
    const promise = nStepObservable(subject, () => mockResponse, isFailure);

    spyOn(api, "signUp").and.callFake(() => subject);

    return promise;
  }

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username Input",
        field: fields[0],
        key: "userName",
        type: "input",
        required: true,
        label: "Username",
        inputType: "text",
      },
      {
        testGroup: "Email Input",
        field: fields[1],
        key: "email",
        type: "input",
        required: true,
        label: "Email Address",
        inputType: "email",
      },
      {
        testGroup: "Password",
        field: fields[2],
        key: "confirmation",
        required: true,
        type: "passwordConfirmation",
      },
    ]);
  });

  assertPageInfo(RegisterComponent, "Register");

  describe("component", () => {
    function setup(): void {
      spec = createComponent({ detectChanges: false });
      api = spec.inject(SecurityService);
      notifications = spec.inject(ToastService);
      session = spec.inject(BawSessionService);
      accounts = spec.inject(ACCOUNT.token);

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();

      accounts.updateContactableConcent = jasmine
        .createSpy("updateContactableConcent")
        .and.returnValue(of());
    }

    beforeEach(() => {
      setup();
    });

    it("should create", () => {
      isSignedIn(false);
      spec.detectChanges();
      expect(spec.component).toBeInstanceOf(RegisterComponent);
    });

    it("should call api", () => {
      spyOn(api, "signUp").and.callThrough();
      isSignedIn(false);
      spec.detectChanges();

      const registerDetails = generateRegisterDetails();
      spec.component.submit(registerDetails);

      expect(api.signUp).toHaveBeenCalledOnceWith(
        new RegisterDetails(registerDetails),
      );
    });

    describe("redirection", () => {
      const redirect = "https://caller.example/callback";

      beforeEach(() => {
        spec.inject(ActivatedRoute).snapshot.queryParams.redirect = redirect;
        spyOn(spec.inject(Router), "navigateByUrl").and.returnValue(Promise.resolve(true));
        isSignedIn(false);
      });

      it("should return to an approved caller after successful registration", async () => {
        const externalRedirect = spyOn(spec.inject(AuthRedirectService), "willRedirectExternally").and.returnValue(true);
        const response = mockSignUp(false);
        spec.detectChanges();
        expect(externalRedirect).not.toHaveBeenCalled();

        spec.component.submit(generateRegisterDetails());
        await response;

        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
        expect(spec.inject(Router).navigateByUrl).not.toHaveBeenCalled();
      });

      it("should fall back home when the external redirect is rejected", async () => {
        const externalRedirect = spyOn(spec.inject(AuthRedirectService), "willRedirectExternally").and.returnValue(false);
        const response = mockSignUp(false);
        spec.detectChanges();

        spec.component.submit(generateRegisterDetails());
        await response;

        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
        expect(spec.inject(Router).navigateByUrl).toHaveBeenCalledWith("/");
      });

      it("should not return to a caller when registration fails", async () => {
        const externalRedirect = spyOn(spec.inject(AuthRedirectService), "willRedirectExternally").and.returnValue(true);
        const response = mockSignUp(true);
        spec.detectChanges();

        spec.component.submit(generateRegisterDetails());
        await response;

        expect(externalRedirect).not.toHaveBeenCalled();
        expect(spec.inject(Router).navigateByUrl).not.toHaveBeenCalled();
      });

      it("should redirect immediately without waiting for the email preference request", () => {
        const externalRedirect = spyOn(spec.inject(AuthRedirectService), "willRedirectExternally").and.returnValue(true);
        const consent = new Subject<User>();
        spyOn(api, "signUp").and.returnValue(of(undefined));
        accounts.updateContactableConcent = jasmine.createSpy().and.returnValue(consent);
        spec.detectChanges();

        spec.component.submit(generateRegisterDetails());
        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
        consent.next(new User({}));
        consent.complete();

        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
      });

      it("should not delay or repeat the redirect if saving the email preference fails", async () => {
        const externalRedirect = spyOn(spec.inject(AuthRedirectService), "willRedirectExternally").and.returnValue(true);
        const warning = spyOn(console, "warn");
        const consent = new Subject<User>();
        spyOn(api, "signUp").and.returnValue(of(undefined));
        accounts.updateContactableConcent = jasmine.createSpy().and.returnValue(consent);
        spec.detectChanges();

        spec.component.submit(generateRegisterDetails());
        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
        consent.error(new Error("Preference update failed"));
        await Promise.resolve();

        expect(warning).toHaveBeenCalledOnceWith(
          "Account created, but your email preference could not be saved.",
        );
        expect(notifications.error).not.toHaveBeenCalled();
        expect(externalRedirect).toHaveBeenCalledOnceWith(redirect);
      });
    });

    describe("recaptcha", () => {
      beforeEach(() => isSignedIn(false));

      it("should request recaptcha seed", () => {
        spyOn(api, "signUpSeed").and.callThrough();
        spec.detectChanges();
        expect(api.signUpSeed).toHaveBeenCalledTimes(1);
        expect(spec.component.recaptchaSeed).toEqual({ state: "loading" });
      });

      it("should set recaptcha settings", async () => {
        const seed = modelData.random.alpha({ count: 10 });
        const action = "register";
        const subject = new Subject<RecaptchaSettings>();
        const promise = nStepObservable(subject, () => ({ seed, action }));
        spyOn(api, "signUpSeed").and.callFake(() => subject);
        spec.detectChanges();
        await promise;

        expect(spec.component.recaptchaSeed).toEqual({
          state: "loaded",
          seed,
          action,
        });
      });

      it("should show error if failed to capture recaptcha seed", async () => {
        const subject = new Subject<RecaptchaSettings>();
        const promise = nStepObservable(
          subject,
          () => generateBawApiError(),
          true,
        );

        spyOn(api, "signUpSeed").and.callFake(() => subject);
        spec.detectChanges();
        await promise;

        expect(notifications.error).toHaveBeenCalledOnceWith(
          "Failed to load form",
        );
      });
    });

    describe("authenticated user", () => {
      it("should show error for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        expect(notifications.error).toHaveBeenCalledOnceWith(
          "You are already logged in.",
        );
      });

      it("should disable submit button for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        const button = spec.query<HTMLButtonElement>("button[type='submit']");
        expect(button).toBeTruthy();
        expect(button!.disabled).toBeTruthy();
      });
    });

    // Setting the user models "contactable" field cannot be done through the
    // user registration request. To set the "contactable" field, we have to
    // make a follow up request after the user has been successfully registered.
    describe("contactable user concent", () => {
      it("should emit 'yes' concent if the user checks the checkbox", async () => {
        const apiResponse = mockSignUp(false);

        spec.component.submit(generateRegisterDetails({ contactable: true }));
        spec.detectChanges();
        await apiResponse;

        expect(api.signUp).toHaveBeenCalledWith(
          jasmine.objectContaining<RegisterDetails>({
            contactable: true,
          }),
        );

        expect(accounts.updateContactableConcent).toHaveBeenCalledOnceWith(
          jasmine.any(Number),
          UserConcent.yes,
        );
      });

      it("should emit 'no' concent if the user unchecks the checkbox", async () => {
        const apiResponse = mockSignUp(false);

        spec.component.submit(generateRegisterDetails({ contactable: false }));
        spec.detectChanges();
        await apiResponse;

        expect(api.signUp).toHaveBeenCalledOnceWith(
          jasmine.objectContaining<RegisterDetails>({
            contactable: false,
          }),
        );

        expect(accounts.updateContactableConcent).toHaveBeenCalledOnceWith(
          jasmine.any(Number),
          UserConcent.no,
        );
      });

      it("should not attempt to update the users concent if registration fails", async () => {
        const apiResponse = mockSignUp(true);

        spec.component.submit(generateRegisterDetails({ contactable: true }));
        spec.detectChanges();
        await apiResponse;

        expect(api.signUp).toHaveBeenCalledTimes(1);
        expect(accounts.updateContactableConcent).not.toHaveBeenCalled();
      });
    });
  });
});
