import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { LoginDetails } from "@models/data/LoginDetails";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { testApiConfig } from "@services/config/configMock.service";
import { FormComponent } from "@shared/form/form.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { LoginComponent } from "./login.component";
import { fields } from "./login.schema.json";

describe("LoginComponent", () => {
  let api: SecurityService;
  let router: Router;
  let location: Location;
  let notifications: ToastrService;
  let spec: SpectatorRouting<LoginComponent>;
  const createComponent = createRoutingFactory({
    component: LoginComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
  });

  function isSignedIn(signedIn: boolean = true) {
    spyOn(api, "isLoggedIn").and.callFake(() => signedIn);
  }

  function setup(redirect?: string | boolean, navigationId?: number) {
    spec = createComponent({ detectChanges: false, queryParams: { redirect } });
    router = spec.router;
    api = spec.inject(SecurityService);
    location = spec.inject(Location);
    notifications = spec.inject(ToastrService);
    spyOn(location, "getState").and.callFake(() => ({
      // Default to no history (navigationId = 1)
      navigationId: navigationId ?? 1,
    }));
    spyOn(location, "back").and.stub();
  }

  function setLoginError() {
    const subject = new Subject<void>();
    const promise = nStepObservable(
      subject,
      () =>
        generateApiErrorDetails("Unauthorized", {
          message: "Incorrect user name, email, or password.",
        }),
      true
    );
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
      isSignedIn(false);
      spec.detectChanges();
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      isSignedIn(false);
      spyOn(api, "signIn").and.callThrough();
      spec.detectChanges();

      spec.component.submit({ login: "username", password: "password" });
      expect(api.signIn).toHaveBeenCalledWith(
        new LoginDetails({ login: "username", password: "password" })
      );
    });
  });

  describe("redirection", () => {
    function redirectUser() {
      spec.component["opts"].redirectUser(undefined);
    }

    it("should redirect user to previous page on login", async () => {
      setup(undefined, 2);
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(location.back).toHaveBeenCalled();
    });

    it("should redirect user to home page on redirect=false", async () => {
      setup(false);
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    });

    it("should redirect user to home page when no previous location remembered", async () => {
      setup();
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      expect(location.back).not.toHaveBeenCalled();
    });

    it("should handle redirect url", async () => {
      setup("/broken_link");
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalledWith("/broken_link");
    });

    it("should give error notification if external redirect", async () => {
      setup(testApiConfig.environment.apiRoot + "/broken_link");
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(notifications.error).toHaveBeenCalledWith(
        "Unable to redirect back to previous page"
      );
    });

    it("should ignore non-ecosounds redirect url", async () => {
      setup("http://broken_link");
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalledWith("/");
    });
  });

  describe("authenticated user", () => {
    it("should show error for authenticated user", () => {
      setup();
      isSignedIn(true);
      spec.detectChanges();
      expect(notifications.error).toHaveBeenCalledWith(
        "You are already logged in."
      );
    });
  });
});
