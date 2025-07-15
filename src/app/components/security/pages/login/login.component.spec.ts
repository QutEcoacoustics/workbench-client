import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { LoginDetails } from "@models/data/LoginDetails";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { testApiConfig } from "@services/config/configMock.service";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { testFormlyFields } from "@test/helpers/formly";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { UNAUTHORIZED } from "http-status";
import { ToastService } from "@services/toasts/toasts.service";
import { of, Subject } from "rxjs";
import { UserConcent } from "@interfaces/apiInterfaces";
import { ToastComponent } from "@shared/toast/toast.component";
import { clickButton, getElementByInnerText } from "@test/helpers/html";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { Component } from "@angular/core";
import { ToastProviderComponent } from "@shared/toast-provider/toast-provider.component";
import { modelData } from "@test/helpers/faker";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { IconsModule } from "@shared/icons/icons.module";
import { LoginComponent } from "./login.component";
import schema from "./login.schema.json";

// we need this component to test the toasts produced by the login component
// we cannot use the typical createComponentFactory because the toast provider
// is typically injected at the app level, and therefore is not embedded through
// the LoginComponent
@Component({
  selector: "baw-test-host",
  template: `
    <baw-toast-provider></baw-toast-provider>
    <baw-authentication-login></baw-authentication-login>
  `,
  imports: [LoginComponent, ToastProviderComponent],
})
class TestHostComponent {}

describe("LoginComponent", () => {
  let api: SecurityService;
  let session: BawSessionService;
  let router: Router;
  let location: Location;
  let notifications: ToastService;
  let accountSpy: AccountsService;
  let spec: SpectatorRouting<TestHostComponent>;
  const { fields } = schema;

  const createComponent = createRoutingFactory({
    component: TestHostComponent,
    imports: [
      ...testFormImports,
      IconsModule,

      ToastComponent,
      FormComponent,
    ],
    providers: testFormProviders,
  });

  const component = () => spec.query(LoginComponent);

  const communicationsDismissButton = () =>
    spec.query<HTMLButtonElement>(".btn-close");
  const communicationsYesButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "Yes");
  const communicationsNoButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "No");

  const usernameField = () =>
    spec.query<HTMLInputElement>("[autocomplete='username']");
  const passwordField = () =>
    spec.query<HTMLInputElement>("[autocomplete='current-password']");
  const submitButton = () =>
    spec.query<HTMLButtonElement>("button[type='submit']");

  function typeInForm(
    username = modelData.internet.userName(),
    password = modelData.internet.password()
  ): void {
    spec.typeInElement(username, usernameField());
    spec.typeInElement(password, passwordField());
    spec.detectChanges();
  }

  function submitForm(): void {
    clickButton(spec, submitButton());
    spec.detectChanges();
  }

  function isSignedIn(signedIn: boolean = true) {
    spyOnProperty(session, "isLoggedIn").and.callFake(() => signedIn);
  }

  function isContactable(contactable: UserConcent): void {
    spyOnProperty(session, "isContactable").and.callFake(() => contactable);
  }

  function mockSignIn(): Promise<void> {
    const subject = new Subject<any>();
    const promise = nStepObservable(subject, () => of(), false);

    spyOn(api, "signIn").and.callFake(() => subject);

    return promise;
  }

  function setup(redirect?: string | boolean, navigationId?: number) {
    spec = createComponent({ detectChanges: false, queryParams: { redirect } });
    router = spec.router;

    api = spec.inject(SecurityService);
    location = spec.inject(Location);
    accountSpy = spec.inject(ACCOUNT.token);

    session = spec.inject(BawSessionService);
    spyOnProperty(session, "loggedInUser").and.returnValue(
      new User(generateUser())
    );

    notifications = spec.inject(ToastService);
    spyOn(notifications, "error").and.callThrough();
    spyOn(notifications, "success").and.callThrough();
    spyOn(notifications, "showToastInfo").and.callThrough();

    spyOn(location, "back").and.stub();
    spyOn(location, "getState").and.callFake(() => ({
      // Default to no history (navigationId = 1)
      navigationId: navigationId ?? 1,
    }));

    accountSpy.optOutContactable = jasmine
      .createSpy("optOutContactable")
      .and.returnValue(of([]));
    accountSpy.optInContactable = jasmine
      .createSpy("optInContactable")
      .and.returnValue(of([]));
  }

  function setLoginError() {
    const subject = new Subject<void>();
    const promise = nStepObservable(
      subject,
      () =>
        generateBawApiError(
          UNAUTHORIZED,
          "Incorrect user name, email, or password."
        ),
      true
    );
    spyOn(api, "signIn").and.callFake(() => subject);
    return promise;
  }

  assertPageInfo(LoginComponent, "Log In");

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
      expect(component()).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      isSignedIn(false);
      spyOn(api, "signIn").and.callThrough();
      spec.detectChanges();

      component().submit({ login: "username", password: "password" });
      expect(api.signIn).toHaveBeenCalledWith(
        new LoginDetails({ login: "username", password: "password" })
      );
    });
  });

  describe("redirection", () => {
    function redirectUser() {
      component()["opts"].redirectUser(undefined);
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

    it("should prioritize the redirect url over navigation history", async () => {
      // By setting the navigationId to 2, we mock the router location being
      // the second location in the history.
      const navigationId = 2;
      const testedRedirect = "/projects/2/audio_recordings";

      setup(testedRedirect, navigationId);
      isSignedIn(false);
      const promise = setLoginError();
      spec.detectChanges();
      redirectUser();

      await promise;

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(testedRedirect);
      expect(location.back).not.toHaveBeenCalled();
    });

    it("should give error notification if external redirect", async () => {
      setup(`${testApiConfig.endpoints.apiRoot}/broken_link`);
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

  describe("communication concent", () => {
    beforeEach(() => {
      setup();
      isSignedIn(false);
      spec.detectChanges();
    });

    describe("prompting conditions", () => {
      it("should show a toast asking to opt-in to communications if they have not been asked", async () => {
        const mockResponse = mockSignIn();

        isContactable(UserConcent.unasked);
        spec.detectChanges();

        typeInForm();
        submitForm();

        await mockResponse;
        spec.detectChanges();

        expect(notifications.showToastInfo).toHaveBeenCalledTimes(1);
      });

      it("should not show a toast if they have given a 'no' response", () => {
        isContactable(UserConcent.no);
        spec.detectChanges();

        typeInForm();
        submitForm();

        expect(notifications.showToastInfo).not.toHaveBeenCalled();
      });

      it("should not show a toast if they have given a 'yes' response", () => {
        isContactable(UserConcent.yes);
        spec.detectChanges();

        typeInForm();
        submitForm();

        expect(notifications.showToastInfo).not.toHaveBeenCalled();
      });

      xit("should not show a toast if the user logs in with incorrect credentials", async () => {
        // we set the contactable property to "unasked" so that if the
        isContactable(UserConcent.unasked);
        const errorPromise = setLoginError();
        spec.detectChanges();

        typeInForm();
        submitForm();

        await errorPromise;

        expect(notifications.showToastInfo).not.toHaveBeenCalled();
      });
    });

    describe("capturing responses", () => {
      beforeEach(async () => {
        const mockResponse = mockSignIn();

        isContactable(UserConcent.unasked);
        spec.detectChanges();

        typeInForm();
        submitForm();

        await mockResponse;
        spec.detectChanges();
      });

      it("should not make any api calls if the toast is dismissed without a response", () => {
        clickButton(spec, communicationsDismissButton());
        expect(accountSpy.optInContactable).not.toHaveBeenCalled();
        expect(accountSpy.optOutContactable).not.toHaveBeenCalled();
      });

      it("should make the correct api calls for a 'yes' response", () => {
        clickButton(spec, communicationsYesButton());
        expect(accountSpy.optInContactable).toHaveBeenCalledOnceWith(
          session.currentUser.id
        );
      });

      it("should make the correct api calls for a 'no' response", () => {
        clickButton(spec, communicationsNoButton());
        expect(accountSpy.optOutContactable).toHaveBeenCalledOnceWith(
          session.currentUser.id
        );
      });
    });
  });
});
