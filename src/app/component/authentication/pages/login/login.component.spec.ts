import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let securityService: SecurityService;
  let router: Router;
  let fixture: ComponentFixture<LoginComponent>;

  class MockSecurityService {
    public login(details: {
      email: string;
      password: string;
    }): Observable<boolean | string> {
      const subject = new Subject<boolean | string>();

      setTimeout(() => {
        if (details.email === "email" && details.password === "password") {
          subject.next(true);
        } else {
          subject.error("Error MSG");
        }
      }, 1000);

      return subject.asObservable();
    }

    public getLoggedInTrigger() {
      return new BehaviorSubject<boolean>(false);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "", component: HomeComponent },
          { path: "security/login", component: LoginComponent }
        ]),
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [LoginComponent, HomeComponent],
      providers: [{ provide: SecurityService, useClass: MockSecurityService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    securityService = TestBed.get(SecurityService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    expect(fixture.nativeElement.querySelector("button")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button").disabled).toBeFalsy();
  });

  it("should contain two inputs", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(2);
  });

  it("should contain username/email input as first input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
      "text"
    );
  });

  it("username/email input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[0].required
    ).toBeTruthy();
  });

  it("username/email input should have email id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "_input_email_"
    );
  });

  it("should contain password input as second input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
      "password"
    );
  });

  it("password input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[1].required
    ).toBeTruthy();
  });

  it("password input should have password id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
      "_input_password_"
    );
  });

  it("should not call submit function with missing email", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing email", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing password", fakeAsync(() => {
    spyOn(component, "submit");

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password", fakeAsync(() => {
    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing fields", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing fields", fakeAsync(() => {
    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with password less than 6 characters long", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with password less than 6 characters long", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should login account on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "login");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalledWith({
      email: "email",
      password: "password"
    });
  }));

  it("should redirect user to home on successful submit", fakeAsync(() => {
    spyOn(router, "navigate");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  }));

  it("should show error on bad email", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "login").and.callThrough();

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "bad email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalledWith({
      email: "bad email",
      password: "password"
    });

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should show error on bad password", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "login").and.callThrough();

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "bad password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalledWith({
      email: "email",
      password: "bad password"
    });

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should show error on bad credentials", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "login").and.callThrough();

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    email.value = "bad email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    password.value = "bad password";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalled();
    expect(securityService.login).toHaveBeenCalledWith({
      email: "bad email",
      password: "bad password"
    });

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));
});
