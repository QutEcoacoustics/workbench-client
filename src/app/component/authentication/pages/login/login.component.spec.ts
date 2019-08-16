import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject } from "rxjs";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  class MockSecurityService {
    public login(details: { email: string; password: string }) {
      return details.email === "email" && details.password === "password";
    }

    public getLoggedInTrigger() {
      return new BehaviorSubject<boolean>(false);
    }
  }

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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    expect(fixture.nativeElement.querySelector("button")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button").disabled).toBeFalsy();
  });

  it("should only contain two inputs", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(2);
  });

  it("should contain username/email input as first input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[0].type).toBe(
      "text"
    );

    // API route expects email as id
    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "email"
    );
  });

  it("should contain password input as second input", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[1]).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("input")[1].type).toBe(
      "password"
    );

    // API route expects email as id
    expect(fixture.nativeElement.querySelectorAll("input")[1].id).toContain(
      "password"
    );
  });

  it("should login account on submit", async(
    inject([Router, SecurityService], (router, securityService) => {
      spyOn(component, "submit");
      spyOn(router, "navigate");
      spyOn(securityService, "login");

      fixture.nativeElement.querySelectorAll("input")[0].value = "email";
      fixture.nativeElement.querySelectorAll("input")[1].value = "password";
      fixture.nativeElement.querySelector("button").click();

      fixture.whenStable().then(() => {
        expect(component.submit).toHaveBeenCalled();
        expect(securityService.login).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalled();
      });

      // expect(router.navigate).toHaveBeenCalledWith(["/"]);
    })
  ));
});
