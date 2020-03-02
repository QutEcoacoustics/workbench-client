import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { testBawServices } from "src/app/test.helper";
import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let api: SecurityService;
  let router: Router;
  let fixture: ComponentFixture<RegisterComponent>;

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
    router = TestBed.inject(Router);

    component.schema.model = {};
  });

  it("should create", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("button[type='submit']")
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector("button[type='submit']").disabled
    ).toBeFalsy();
  });

  it("should contain four inputs", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(4);
  });

  it("should contain username input as first input", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
      "text"
    );
  });

  it("username input should be required field", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[0].required
    ).toBeTruthy();
  });

  it("username input should have username id", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "_input_username_"
    );
  });

  it("should contain email input as second input", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
      "email"
    );
  });

  it("email input should be required field", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[1].required
    ).toBeTruthy();
  });

  it("email input should have email id", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
      "_input_email_"
    );
  });

  it("should contain password input as third input", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[2]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[2].type).toBe(
      "password"
    );
  });

  it("password input should be required field", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[2].required
    ).toBeTruthy();
  });

  it("password input should have password id", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[2].id).toContain(
      "_input_password_"
    );
  });

  it("should contain password confirmation input as fourth input", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[3]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[3].type).toBe(
      "password"
    );
  });

  it("password confirmation input should be required field", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll("input")[3].required
    ).toBeTruthy();
  });

  it("password confirmation input should have passwordConfirm id", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll("input")[3].id).toContain(
      "_input_passwordConfirm_"
    );
  });

  it("should not call submit function with missing username", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing username", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "";
    username.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing email", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing email", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing password", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "";
    password.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with missing password confirmation", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing password confirmation", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  xit("should not call submit function with non matching passwords", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "bad password";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  xit("should show error message with non matching passwords", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "password";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "bad password";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should not call submit function with password less than 6 characters long", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "12345";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with password less than 6 characters long", fakeAsync(() => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);
    spyOn(component, "submit");
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelectorAll("input")[0];
    username.value = "username";
    username.dispatchEvent(new Event("input"));

    const email = fixture.nativeElement.querySelectorAll("input")[1];
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const password = fixture.nativeElement.querySelectorAll("input")[2];
    password.value = "12345";
    password.dispatchEvent(new Event("input"));

    const passwordConf = fixture.nativeElement.querySelectorAll("input")[3];
    passwordConf.value = "12345";
    passwordConf.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should show error for authenticated user", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => true);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  });

  it("should disable submit button for authenticated user", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  });

  xit("should register account on submit", () => {});
});
