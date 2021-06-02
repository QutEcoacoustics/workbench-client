import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { RecaptchaSettings } from "@baw-api/baw-form-api.service";
import { SecurityService } from "@baw-api/security/security.service";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { modelData } from "@test/helpers/faker";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { RegisterComponent } from "./register.component";
import { fields } from "./register.schema.json";

describe("RegisterComponent", () => {
  let api: SecurityService;
  let toastr: ToastrService;
  let spec: Spectator<RegisterComponent>;
  const createComponent = createComponentFactory({
    component: RegisterComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
  });

  function isSignedIn(signedIn: boolean = true) {
    spyOn(api, "isLoggedIn").and.callFake(() => signedIn);
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

  describe("component", () => {
    beforeEach(() => {
      spec = createComponent({ detectChanges: false });
      api = spec.inject(SecurityService);
      toastr = spec.inject(ToastrService);

      spyOn(toastr, "success").and.stub();
      spyOn(toastr, "error").and.stub();
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
      expect(api.signUp).toHaveBeenCalledWith(
        new RegisterDetails(registerDetails)
      );
    });

    describe("recaptcha", () => {
      beforeEach(() => isSignedIn(false));

      it("should request recaptcha seed", () => {
        spyOn(api, "signUpSeed").and.callThrough();
        spec.detectChanges();
        expect(api.signUpSeed).toHaveBeenCalled();
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
          () => generateApiErrorDetails(),
          true
        );
        spyOn(api, "signUpSeed").and.callFake(() => subject);
        spec.detectChanges();
        await promise;
        expect(toastr.error).toHaveBeenCalledWith("Failed to load form");
      });
    });

    describe("authenticated user", () => {
      it("should show error for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        expect(toastr.error).toHaveBeenCalledWith("You are already logged in.");
      });

      it("should disable submit button for authenticated user", () => {
        isSignedIn(true);
        spec.detectChanges();
        const button = spec.query<HTMLButtonElement>("button[type='submit']");
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTruthy();
      });
    });
  });
});
