import { Location } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject, Subject } from "rxjs";
import { formlyRoot, testBawServices } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SessionUser } from "src/app/models/User";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import {
  LoginDetails,
  SecurityService
} from "src/app/services/baw-api/security.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let securityService: SecurityService;
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [LoginComponent, HomeComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    securityService = TestBed.get(SecurityService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    component.schema.model = {
      login: "",
      password: ""
    };
  });

  it("should create", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("button[type='submit']")
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector("button[type='submit']").disabled
    ).toBeFalsy();
  });

  it("should contain two inputs", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(2);
  });

  it("should contain username/email input as first input", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
      "text"
    );
  });

  it("username/email input should be required field", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[0].required
    ).toBeTruthy();
  });

  it("username/email input should have login id", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "_login_"
    );
  });

  it("should contain password input as second input", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
      "password"
    );
  });

  it("password input should be required field", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[1].required
    ).toBeTruthy();
  });

  it("password input should have password id", () => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
      "_input_password_"
    );
  });

  it("should not call submit function with missing username", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing username", fakeAsync(() => {
    spyOn(component, "submit");
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing password", fakeAsync(() => {
    spyOn(component, "submit");
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing fields", fakeAsync(() => {
    spyOn(component, "submit");
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing fields", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with password less than 6 characters long", fakeAsync(() => {
    spyOn(component, "submit");
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with password less than 6 characters long", fakeAsync(() => {
    spyOn(component, "submit");
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should login account on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn").and.callFake(() => {
      return new BehaviorSubject<SessionUser>(
        new SessionUser({ authToken: "xxxxxxxxxxxxxxx", userName: "username" })
      );
    });
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

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
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    spyOn(securityService, "signIn").and.callFake(() => {
      const subject = new Subject<SessionUser>();

      subject.error({
        status: 401,
        message:
          "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
      } as ApiErrorDetails);

      return subject;
    });
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "bad username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "bad password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(100);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalledWith(
      new LoginDetails({
        login: "bad username",
        password: "bad password"
      })
    );

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain(
      "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
    );
  }));

  it("should show error for authenticated user", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => true);
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("You are already logged in");
  }));

  it("should disable submit button for authenticated user", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  }));

  it("should disable submit button during submission", fakeAsync(() => {
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn").and.callFake(() => {
      expect(button).toBeTruthy();
      expect(button.disabled).toBeTruthy();

      return new BehaviorSubject<SessionUser>(
        new SessionUser({ authToken: "xxxxxxxxxxxxxxx", userName: "username" })
      );
    });

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    button.click();

    tick();
    fixture.detectChanges();
  }));

  it("should redirect to home page on successful login", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn").and.callFake(() => {
      return new BehaviorSubject<SessionUser>(
        new SessionUser({ authToken: "xxxxxxxxxxxxxxx", userName: "username" })
      );
    });
    spyOn(securityService, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([""]);
  }));
});
