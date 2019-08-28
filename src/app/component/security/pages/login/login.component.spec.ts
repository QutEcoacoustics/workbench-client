import { Location } from "@angular/common";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject } from "rxjs";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { MockSecurityService } from "src/app/services/baw-api/mock/securityMockService";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let securityService: SecurityService;
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
    location = TestBed.get(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    expect(
      fixture.nativeElement.querySelector("button[type='submit']")
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector("button[type='submit']").disabled
    ).toBeFalsy();
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should login account on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn");

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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalledWith({
      email: "email",
      password: "password"
    });
  }));

  // TODO Implement, currently this fails because navigation does not occur
  xit("should redirect to home page on successful login", fakeAsync(() => {
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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  }));

  it("should show error on bad email", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn").and.callThrough();

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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalledWith({
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
    spyOn(securityService, "signIn").and.callThrough();

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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalledWith({
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
    spyOn(securityService, "signIn").and.callThrough();

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

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(5000);
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalled();
    expect(securityService.signIn).toHaveBeenCalledWith({
      email: "bad email",
      password: "bad password"
    });

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should show error for authenticated user", fakeAsync(() => {
    securityService.signIn({ email: "email", password: "password" });

    tick(5000);
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should disable submit button for authenticated user", fakeAsync(() => {
    securityService.signIn({ email: "email", password: "password" });

    tick(5000);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  }));

  it("should disable submit button during submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(securityService, "signIn").and.callFake(() => {
      expect(button).toBeTruthy();
      expect(button.disabled).toBeTruthy();

      return new BehaviorSubject<boolean>(true);
    });

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy();

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

    button.click();

    tick();
    fixture.detectChanges();
  }));
});
