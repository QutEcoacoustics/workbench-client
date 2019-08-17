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
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let securityService: SecurityService;
  let router: Router;
  let fixture: ComponentFixture<RegisterComponent>;

  class MockSecurityService {
    public register(details: {
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
          { path: "security/register", component: RegisterComponent }
        ]),
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [RegisterComponent, HomeComponent],
      providers: [{ provide: SecurityService, useClass: MockSecurityService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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

  it("should contain four inputs", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(4);
  });

  it("should contain username input as first input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
      "text"
    );
  });

  it("username input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[0].required
    ).toBeTruthy();
  });

  it("username input should have username id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "_input_username_"
    );
  });

  it("should contain email input as second input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
      "email"
    );
  });

  it("email input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[1].required
    ).toBeTruthy();
  });

  it("email input should have email id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
      "_input_email_"
    );
  });

  it("should contain password input as third input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[2]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[2].type).toBe(
      "password"
    );
  });

  it("password input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[2].required
    ).toBeTruthy();
  });

  it("password input should have password id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[2].id).toContain(
      "_input_password_"
    );
  });

  it("should contain password confirmation input as fourth input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[3]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[3].type).toBe(
      "password"
    );
  });

  it("password confirmation input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[3].required
    ).toBeTruthy();
  });

  it("password confirmation input should have passwordConfirm id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[3].id).toContain(
      "_input_passwordConfirm_"
    );
  });

  it("should not call submit function with missing username", fakeAsync(() => {
    spyOn(component, "submit");

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing username", fakeAsync(() => {
    spyOn(component, "submit");

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing email", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
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
    )[1];
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
    )[2];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password", fakeAsync(() => {
    spyOn(component, "submit");

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
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

  it("should not call submit function with missing password confirmation", fakeAsync(() => {
    spyOn(component, "submit");

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password confirmation", fakeAsync(() => {
    spyOn(component, "submit");

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with non matching passwords", fakeAsync(() => {
    spyOn(component, "submit");

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "bad password";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with non matching passwords", fakeAsync(() => {
    spyOn(component, "submit");

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "bad password";
    passwordConf.dispatchEvent(new Event("input"));

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

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "12345";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with password less than 6 characters long", fakeAsync(() => {
    spyOn(component, "submit");

    const username = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    passwordConf.value = "12345";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  xit("should register account on submit", () => {});
});
