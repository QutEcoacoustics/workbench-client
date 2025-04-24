import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
import { RecaptchaSettings } from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { modelData } from "@test/helpers/faker";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { of, Subject } from "rxjs";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { AccountsService } from "@baw-api/account/accounts.service";
import { UserConcent } from "@interfaces/apiInterfaces";
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
    providers: [...testFormProviders, provideMockBawApi()],
  });

  function isSignedIn(signedIn: boolean = true) {
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
        new RegisterDetails(registerDetails)
      );
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
          true
        );

        spyOn(api, "signUpSeed").and.callFake(() => subject);
        spec.detectChanges();
        await promise;

        expect(notifications.error).toHaveBeenCalledOnceWith(
          "Failed to load form"
        );
      });
    });

    describe("authenticated user", () => {
      it("should show error for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        expect(notifications.error).toHaveBeenCalledOnceWith(
          "You are already logged in."
        );
      });

      it("should disable submit button for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        const button = spec.query<HTMLButtonElement>("button[type='submit']");
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTruthy();
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
          })
        );

        expect(accounts.updateContactableConcent).toHaveBeenCalledOnceWith(
          jasmine.any(Number),
          UserConcent.yes
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
          })
        );

        expect(accounts.updateContactableConcent).toHaveBeenCalledOnceWith(
          jasmine.any(Number),
          UserConcent.no
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
