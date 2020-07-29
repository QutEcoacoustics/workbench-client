import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  LoginDetails,
  SecurityService,
} from "@baw-api/security/security.service";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { testApiConfig } from "@services/app-config/appConfigMock.service";
import { FormComponent } from "@shared/form/form.component";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { testBawServices, testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { LoginComponent } from "./login.component";
import { fields } from "./login.schema.json";

describe("LoginComponent New", () => {
  let api: SecurityService;
  let router: Router;
  let location: Location;
  let spectator: SpectatorRouting<LoginComponent>;
  const createComponent = createRoutingFactory({
    component: LoginComponent,
    imports: testFormImports,
    declarations: [FormComponent],
    providers: testBawServices,
    mocks: [ToastrService],
    stubsEnabled: true,
  });

  function setup(redirect?: string | boolean, navigationId?: number) {
    spectator = createComponent({
      detectChanges: false,
      queryParams: { redirect },
    });

    router = spectator.router;
    api = spectator.inject(SecurityService);
    location = spectator.inject(Location);
    spyOn(location, "getState").and.callFake(() => ({
      // Default to no history (navigationId = 1)
      navigationId: navigationId ?? 1,
    }));
    spyOn(location, "back").and.stub();
    spyOn(spectator.component, "externalRedirect").and.stub();
  }

  function setLoginError() {
    const subject = new Subject<void>();
    const error: ApiErrorDetails = {
      status: 401,
      message: "Incorrect user name, email, or password.",
    };
    const promise = nStepObservable(subject, () => error, true);
    spyOn(api, "signIn").and.callFake(() => subject);
    return promise;
  }

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username Input",
        field: fields[0],
        key: "login",
        label: "Username or Email Address",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Password Input",
        field: fields[1],
        key: "password",
        label: "Password",
        type: "input",
        inputType: "password",
        required: true,
      },
    ]);
  });

  describe("component", () => {
    it("should create", () => {
      setup();
      spectator.detectChanges();
      expect(spectator.component).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      spyOn(api, "signIn").and.callThrough();
      spectator.detectChanges();

      spectator.component.submit({ login: "username", password: "password" });
      expect(api.signIn).toHaveBeenCalledWith(
        new LoginDetails({ login: "username", password: "password" })
      );
    });
  });

  describe("redirection", () => {
    it("should redirect user to previous page on login", async () => {
      setup(undefined, 2);
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(location.back).toHaveBeenCalled();
    });

    it("should redirect user to home page on redirect=false", async () => {
      setup(false);
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    });

    it("should redirect user to home page when no previous location remembered", async () => {
      setup();
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    });

    it("should handle redirect url", async () => {
      setup("/broken_link");
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/broken_link");
    });

    it("should handle ecosounds redirect url", async () => {
      setup(testApiConfig.environment.apiRoot + "/broken_link");
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(spectator.component.externalRedirect).toHaveBeenCalled();
      expect(spectator.component.externalRedirect).toHaveBeenCalledWith(
        testApiConfig.environment.apiRoot + "/broken_link"
      );
    });

    it("should ignore non-ecosounds redirect url", async () => {
      setup("http://broken_link");
      const promise = setLoginError();
      spectator.detectChanges();
      spectator.component["redirectUser"]();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
    });
  });
});
