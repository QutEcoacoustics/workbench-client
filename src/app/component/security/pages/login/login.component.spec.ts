import { Location } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject, Subject } from "rxjs";
import { formlyRoot } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SessionUser } from "src/app/models/User";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  LoginDetails,
  SecurityService
} from "src/app/services/baw-api/security.service";
import { DeploymentEnvironmentService } from "src/app/services/environment/deployment-environment.service";
import { testBawServices } from "src/app/test.helper";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let securityService: SecurityService;
  let router: Router;
  let route: ActivatedRoute;
  let location: Location;
  let env: DeploymentEnvironmentService;
  let fixture: ComponentFixture<LoginComponent>;

  class MockActivatedRoute {
    public queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>(
      {}
    );

    public setRedirectUrl(url: string) {
      this.queryParams = new BehaviorSubject<Params>({ redirect: url });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [LoginComponent, HomeComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    securityService = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
    env = TestBed.inject(DeploymentEnvironmentService);

    component.schema.model = {
      login: "",
      password: ""
    };
  });

  function fixRouting(id?: number) {
    spyOn(location, "getState").and.callFake(() => ({
      navigationId: id ? id : 1
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

  function createSubmitSpies(failure?: boolean) {
    spyOn(location, "back").and.stub();
    spyOn(router, "navigateByUrl").and.stub();
    spyOn(component, "externalRedirect").and.stub();
    spyOn(securityService, "signIn").and.callFake(() => {
      if (!failure) {
        return new BehaviorSubject<SessionUser>(
          new SessionUser({
            authToken: "xxxxxxxxxxxxxxx",
            userName: "username"
          })
        );
      }

      const subject = new Subject<SessionUser>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message:
            "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });
  }

  it("should create", () => {
    fixRouting();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("form inputs", () => {
    it("should eventually load form", () => {
      fixRouting();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should contain two inputs", () => {
      fixRouting();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input").length).toBe(2);
    });

    it("should contain username/email input as first input", () => {
      fixRouting();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
      expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
        "text"
      );
    });

    it("username/email input should be required field", () => {
      fixRouting();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll("input")[0].required
      ).toBeTruthy();
    });

    it("username/email input should have login id", () => {
      fixRouting();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
        "_login_"
      );
    });

    it("should contain password input as second input", () => {
      fixRouting();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
      expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
        "password"
      );
    });

    it("password input should be required field", () => {
      fixRouting();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelectorAll("input")[1].required
      ).toBeTruthy();
    });

    it("password input should have password id", () => {
      fixRouting();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
        "_input_password_"
      );
    });
  });

  describe("submit logic", () => {
    it("should not call submit function with missing username", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillPassword();
      submit();

      expect(component.submit).not.toHaveBeenCalled();
    }));

    it("should show error message with missing username", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillPassword();
      submit();

      const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
      expect(msg).toBeTruthy();
      expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
    }));

    it("should not call submit function with missing password", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      submit();

      expect(component.submit).not.toHaveBeenCalled();
    }));

    it("should show error message with missing password", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      submit();

      const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
      expect(msg).toBeTruthy();
      expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
    }));

    it("should not call submit function with missing fields", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      submit();

      expect(component.submit).not.toHaveBeenCalled();
    }));

    it("should show error message with missing fields", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      submit();

      const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
      expect(msg).toBeTruthy();
      expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
    }));

    it("should not call submit function with password less than 6 characters long", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      fillPassword("12345");
      submit();

      expect(component.submit).not.toHaveBeenCalled();
    }));

    it("should show error message with password less than 6 characters long", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit");
      fixture.detectChanges();

      fillUsername();
      fillPassword("12345");
      submit();

      const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
      expect(msg).toBeTruthy();
      expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
    }));

    it("should login account on submit", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      spyOn(component, "submit").and.callThrough();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(component.submit).toHaveBeenCalled();
      expect(securityService.signIn).toHaveBeenCalled();
      expect(securityService.signIn).toHaveBeenCalledWith(
        new LoginDetails({
          login: "username",
          password: "password"
        })
      );
    }));

    it("should show error on bad credentials", fakeAsync(() => {
      createSubmitSpies(true);
      fixRouting();
      spyOn(component, "submit").and.callThrough();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      tick();
      fixture.detectChanges();

      const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
      expect(msg).toBeTruthy();
      expect(msg.innerText).toContain(
        "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
      );
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      fixRouting();
      spyOn(component, "submit").and.callThrough();
      spyOn(securityService, "signIn").and.callFake(() => {
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTruthy();

        return new BehaviorSubject<SessionUser>(
          new SessionUser({
            authToken: "xxxxxxxxxxxxxxx",
            userName: "username"
          })
        );
      });

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );

      expect(button).toBeTruthy();
      expect(button.disabled).toBeFalsy();

      fillUsername();
      fillPassword();
      submit();
    }));
  });

  describe("redirection", () => {
    it("should redirect user to previous page on login", fakeAsync(() => {
      fixRouting(2);
      createSubmitSpies();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(location.back).toHaveBeenCalled();
    }));

    it("should redirect user to home page on redirect=false", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      route["setRedirectUrl"](false);
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should redirect user to home page when no previous location remembered", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should handle redirect url", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      route["setRedirectUrl"]("/broken_link");
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/broken_link");
    }));

    it("should handle ecosounds redirect url", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      route["setRedirectUrl"](env.getEnvironment().apiRoot + "/broken_link");
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalledWith(
        env.getEnvironment().apiRoot + "/broken_link"
      );
    }));

    it("should ignore non-ecosounds redirect url", fakeAsync(() => {
      createSubmitSpies();
      fixRouting();
      route["setRedirectUrl"]("http://broken_link");
      fixture.detectChanges();

      fillUsername();
      fillPassword();
      submit();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
    }));
  });
});
