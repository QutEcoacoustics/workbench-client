import { Location } from "@angular/common";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { LoginDetails, SecurityService } from "@baw-api/security.service";
import { HomeComponent } from "@component/home/home.component";
import { testApiConfig } from "@services/app-config/appConfigMock.service";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { testFormlyFields } from "src/app/test/helpers/formly";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
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
          useClass: mockActivatedRoute(
            {},
            {},
            {},
            redirect ? { redirect } : {}
          ),
        },
      ],
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
      navigationId: navigationId ? navigationId : 1,
    }));
  }

  function apiResponse() {
    spyOn(api, "signIn").and.callFake(() => {
      const subject = new Subject<void>();
      subject.error({
        status: 401,
        message:
          "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked.",
      } as ApiErrorDetails);
      return subject;
    });
  }

  const formInputs = [
    {
      testGroup: "Username Input",
      setup: undefined,
      field: fields[0],
      key: "login",
      htmlType: "input",
      required: true,
      label: "Username or Email Address",
      type: "text",
      description: undefined,
    },
    {
      testGroup: "Password Input",
      setup: undefined,
      field: fields[1],
      key: "password",
      htmlType: "input",
      required: true,
      label: "Password",
      type: "password",
      description: undefined,
    },
  ];

  describe("form", () => {
    testFormlyFields(formInputs);
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule();
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it("should call api", () => {
      configureTestingModule();
      spyOn(api, "signIn").and.callThrough();
      fixture.detectChanges();

      component.submit({ login: "username", password: "password" });
      expect(api.signIn).toHaveBeenCalledWith(
        new LoginDetails({ login: "username", password: "password" })
      );
    });
  });

  describe("redirection", () => {
    it("should redirect user to previous page on login", fakeAsync(() => {
      configureTestingModule(undefined, 2);
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(location.back).toHaveBeenCalled();
    }));

    it("should redirect user to home page on redirect=false", fakeAsync(() => {
      configureTestingModule(false);
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should redirect user to home page when no previous location remembered", fakeAsync(() => {
      configureTestingModule();
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    }));

    it("should handle redirect url", fakeAsync(() => {
      configureTestingModule("/broken_link");
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/broken_link");
    }));

    it("should handle ecosounds redirect url", fakeAsync(() => {
      configureTestingModule(
        testApiConfig.environment.apiRoot + "/broken_link"
      );
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalled();
      expect(component.externalRedirect).toHaveBeenCalledWith(
        testApiConfig.environment.apiRoot + "/broken_link"
      );
    }));

    it("should ignore non-ecosounds redirect url", fakeAsync(() => {
      configureTestingModule("http://broken_link");
      apiResponse();
      fixture.detectChanges();

      component["redirectUser"]();

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
    }));
  });
});
