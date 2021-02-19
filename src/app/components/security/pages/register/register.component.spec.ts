import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  RegisterDetails,
  SecurityService,
} from "@baw-api/security/security.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateRegisterDetails } from "@test/fakes/RegisterDetails";
import { testFormlyFields } from "@test/helpers/formly";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
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

  xdescribe("component", () => {
    beforeEach(() => {
      spec = createComponent({ detectChanges: true });
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
      spec.detectChanges();

      const registerDetails = generateRegisterDetails();
      spec.component.submit(registerDetails);
      expect(api.signUp).toHaveBeenCalledWith(
        new RegisterDetails(registerDetails)
      );
    });

    // TODO
    describe("recaptcha", () => {
      it("should request recaptcha seed", () => {});

      it("should set recaptcha seed", () => {});
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
