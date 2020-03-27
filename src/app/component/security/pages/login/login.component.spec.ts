import { Location } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testApiConfig } from "src/app/services/app-config/appConfigMock.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  LoginDetails,
  SecurityService
} from "src/app/services/baw-api/security.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import {
  assertValidationMessage,
  getInputs,
  testFormlyField
} from "src/testHelpers";
import { LoginComponent } from "./login.component";
import { fields } from "./login.json";

describe("LoginComponent", () => {
  let api: SecurityService;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    redirect?: string | boolean,
    navigationId?: number
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, RouterTestingModule, SharedModule],
      declarations: [LoginComponent, HomeComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute({}, {}, {}, redirect ? { redirect } : {})
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    notifications = TestBed.inject(ToastrService);

    spyOn(component, "externalRedirect").and.stub();
    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();
    spyOn(location, "back").and.stub();
    spyOn(location, "getState").and.callFake(() => ({
      navigationId: navigationId ? navigationId : 1
    }));
  }

  function fillUsername(user?: string) {
    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = user ? user : "username";
    username.dispatchEvent(new Event("input"));
  }

  function fillPassword(pass?: string) {
    const password = fixture.nativeElement.querySelectorAll("input")[1];
    password.value = pass ? pass : "password";
    password.dispatchEvent(new Event("input"));
  }

  function submit() {
    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();
    fixture.detectChanges();

    tick(100);
    fixture.detectChanges();
  }

  function successResponse(signedIn: boolean = true) {
    spyOn(api, "signIn").and.callFake(() => {
      if (signedIn) {
        return new BehaviorSubject<void>(null);
      }

      const subject = new Subject<void>();
      subject.error({
        status: 401,
        message:
          "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
      } as ApiErrorDetails);
      return subject;
    });
  }

  it("should create", () => {
    configureTestingModule();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("form inputs", () => {
    it("should eventually load form", () => {
      configureTestingModule();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should contain two inputs", () => {
      configureTestingModule();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll("form formly-field").length
      ).toBe(2);
    });

    /* Username */
    testFormlyField(
      "Username Input",
      () => {
        configureTestingModule();
      },
      fields[0],
      "login",
      "input",
      true,
      "Username or Email Address",
      "text"
    );

    /* Project Description Textarea */
    testFormlyField(
      "Password Input",
      () => {
        configureTestingModule();
      },
      fields[1],
      "password",
      "input",
      true,
      "Password",
      "password"
    );
  });

  describe("submit logic", () => {
    it("should show error message with missing username", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillPassword();
      submit();

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should show error message with missing password", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      submit();

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should show error message with missing fields", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      spyOn(component, "submit");
      fixture.detectChanges();

      submit();

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should show error message with password less than 6 characters long", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      fillPassword("12345");
      submit();

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
      assertValidationMessage(
        getInputs(fixture)[1],
        "Input should have at least 6 characters"
      );
    }));

    it("should login account on submit", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      spyOn(component, "submit").and.callThrough();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(component.submit).toHaveBeenCalled();
      expect(api.signIn).toHaveBeenCalled();
      expect(api.signIn).toHaveBeenCalledWith(
        new LoginDetails({
          login: "username",
          password: "password"
        })
      );
    }));

    it("should show error on bad credentials", fakeAsync(() => {
      configureTestingModule();
      successResponse(false);
      spyOn(component, "submit").and.callThrough();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(notifications.error).toHaveBeenCalledWith(
        "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
      );
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      configureTestingModule();
      spyOn(component, "submit").and.callThrough();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );

      fillUsername();
      fillPassword();
      submit();

      expect(button).toBeTruthy();
      expect(button.disabled).toBeTruthy();
    }));

    it("should display success on successful submit", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(notifications.success).toHaveBeenCalledWith(
        "Successfully signed in"
      );
    }));
  });

  describe("redirection", () => {
    it("should redirect user to previous page on login", fakeAsync(() => {
      configureTestingModule(undefined, 2);
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(location.back).toHaveBeenCalled();
    }));

    it("should redirect user to home page on redirect=false", fakeAsync(() => {
      configureTestingModule(false);
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should redirect user to home page when no previous location remembered", fakeAsync(() => {
      configureTestingModule();
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should handle redirect url", fakeAsync(() => {
      configureTestingModule("/broken_link");
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/broken_link");
    }));

    it("should handle ecosounds redirect url", fakeAsync(() => {
      configureTestingModule(
        testApiConfig.environment.apiRoot + "/broken_link"
      );
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalledWith(
        testApiConfig.environment.apiRoot + "/broken_link"
      );
    }));

    it("should ignore non-ecosounds redirect url", fakeAsync(() => {
      configureTestingModule("http://broken_link");
      successResponse();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
    }));
  });
});
