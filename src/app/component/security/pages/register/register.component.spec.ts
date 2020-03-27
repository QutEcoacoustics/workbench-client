import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { testBawServices } from "src/app/test.helper";
import {
  assertValidationMessage,
  getInputs,
  inputValue,
  submitForm,
  testFormlyFields
} from "src/testHelpers";
import { RegisterComponent } from "./register.component";
import { fields } from "./register.json";

describe("RegisterComponent", () => {
  let api: SecurityService;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let notifications: ToastrService;

  const usernameIndex = 1;
  const emailIndex = 2;
  const passwordIndex = 3;
  const passwordConfIndex = 4;

  function isSignedIn(signedIn: boolean = true) {
    spyOn(api, "isLoggedIn").and.callFake(() => signedIn);
  }

  const formInputs = [
    {
      testGroup: "Username Input",
      setup: undefined,
      field: fields[0].fieldGroup[0],
      key: "username",
      htmlType: "input",
      required: true,
      label: "Username",
      type: "text",
      description: undefined
    },
    {
      testGroup: "Email Input",
      setup: undefined,
      field: fields[0].fieldGroup[1],
      key: "email",
      htmlType: "input",
      required: true,
      label: "Email Address",
      type: "email",
      description: undefined
    },
    {
      testGroup: "Password Input",
      setup: undefined,
      field: fields[0].fieldGroup[2],
      key: "password",
      htmlType: "input",
      required: true,
      label: "Password",
      type: "password",
      description: undefined
    },
    {
      testGroup: "Password Confirmation Input",
      setup: undefined,
      field: fields[0].fieldGroup[3],
      key: "passwordConfirm",
      htmlType: "input",
      required: true,
      label: "Password Confirmation",
      type: "password",
      description: undefined
    }
  ];

  describe("form", () => {
    testFormlyFields(formInputs);
  });

  describe("component", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [...appLibraryImports, RouterTestingModule, SharedModule],
        declarations: [RegisterComponent],
        providers: [...testBawServices]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      api = TestBed.inject(SecurityService);
      notifications = TestBed.inject(ToastrService);

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    it("should create", () => {
      isSignedIn(false);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    // TODO
    xit("should call api", () => {});

    it("should display error if password and password confirmation do not match", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[usernameIndex], "input", "username");
      inputValue(inputs[emailIndex], "input", "a@b.com.au");
      inputValue(inputs[passwordIndex], "input", "password 1");
      inputValue(inputs[passwordConfIndex], "input", "password 2");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
      assertValidationMessage(
        inputs[passwordConfIndex],
        "Passwords do not match."
      );
    }));

    it("should display error if password is less than 6 characters", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[usernameIndex], "input", "username");
      inputValue(inputs[emailIndex], "input", "a@b.com.au");
      inputValue(inputs[passwordIndex], "input", "pass");
      inputValue(inputs[passwordConfIndex], "input", "pass");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
      assertValidationMessage(
        inputs[passwordConfIndex],
        "Input should have at least 6 characters"
      );
    }));

    describe("authenticated user", () => {
      it("should show error for authenticated user", () => {
        isSignedIn(true);
        fixture.detectChanges();

        expect(notifications.error).toHaveBeenCalledWith(
          "You are already logged in."
        );
      });

      it("should disable submit button for authenticated user", () => {
        isSignedIn(true);
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector(
          "button[type='submit']"
        );
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTruthy();
      });
    });
  });
});
