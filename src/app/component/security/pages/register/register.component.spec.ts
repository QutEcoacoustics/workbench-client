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
  testFormlyField
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

  describe("form inputs", () => {
    it("should eventually load form", () => {
      isSignedIn(false);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should contain four inputs", () => {
      isSignedIn(false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input").length).toBe(4);
    });

    /* Username */
    testFormlyField(
      "Username Input",
      undefined,
      fields[0].fieldGroup[0],
      "username",
      "input",
      true,
      "Username",
      "text"
    );

    /* Email */
    testFormlyField(
      "Email Input",
      undefined,
      fields[0].fieldGroup[1],
      "email",
      "input",
      true,
      "Email Address",
      "email"
    );

    /* Password */
    testFormlyField(
      "Password Input",
      undefined,
      fields[0].fieldGroup[2],
      "password",
      "input",
      true,
      "Password",
      "password"
    );

    /* Password Confirmation */
    testFormlyField(
      "Password Confirmation Input",
      undefined,
      fields[0].fieldGroup[3],
      "passwordConfirm",
      "input",
      true,
      "Password Confirmation",
      "password"
    );
  });

  describe("submit logic", () => {
    it("should display error with missing username", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[emailIndex], "input", "a@b.com.au");
      inputValue(inputs[passwordIndex], "input", "password");
      inputValue(inputs[passwordConfIndex], "input", "password");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should display error with missing email", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[usernameIndex], "input", "username");
      inputValue(inputs[passwordIndex], "input", "password");
      inputValue(inputs[passwordConfIndex], "input", "password");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should display error with missing password", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[usernameIndex], "input", "username");
      inputValue(inputs[emailIndex], "input", "a@b.com.au");
      inputValue(inputs[passwordConfIndex], "input", "password");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should display error with missing password confirmation", fakeAsync(() => {
      isSignedIn(false);
      spyOn(component, "submit");
      fixture.detectChanges();

      const inputs = getInputs(fixture);
      inputValue(inputs[usernameIndex], "input", "username");
      inputValue(inputs[emailIndex], "input", "a@b.com.au");
      inputValue(inputs[passwordIndex], "input", "password");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

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
  });

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

  // TODO Write this test
  xit("should register account on submit", () => {});
});
