import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
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
import { testFormImports } from "@test/helpers/testbed";
import { UNAUTHORIZED } from "http-status";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { UserConcent } from "@interfaces/apiInterfaces";
import { ToastComponent } from "@shared/toast/toast.component";
import { clickButton, getElementByInnerText } from "@test/helpers/html";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { User } from "@models/User";
import { LoginComponent } from "./login.component";
import schema from "./login.schema.json";

describe("LoginComponent", () => {
  let api: SecurityService;
  let session: BawSessionService;
  let router: Router;
  let location: Location;
  let notifications: ToastService;
  let accountSpy: AccountsService;
  let spec: SpectatorRouting<LoginComponent>;
  const { fields } = schema;

  const createComponent = createRoutingFactory({
    component: LoginComponent,
    imports: [...testFormImports, MockBawApiModule, ToastComponent],
    declarations: [FormComponent],
    mocks: [ToastService],
  });

  const communicationsDismissButton = () => spec.query(".btn-close");
  const communicationsYesButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "Yes");
  const communicationsNoButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "No");
  const communicationsConcentToast = () =>
    spec.query("baw-toast") as any as ToastComponent;

  function isSignedIn(signedIn: boolean = true) {
    spyOnProperty(session, "isLoggedIn").and.callFake(() => signedIn);
  }

  function isContactable(contactable: UserConcent): void {
    spyOnProperty(session, "isContactable").and.callFake(() => contactable);
  }

  function setup(redirect?: string | boolean, navigationId?: number) {
    spec = createComponent({ detectChanges: false, queryParams: { redirect } });
    router = spec.router;

    api = spec.inject(SecurityService);
    session = spec.inject(BawSessionService);
    location = spec.inject(Location);
    accountSpy = spec.inject(ACCOUNT.token);

    notifications = spec.inject(ToastService);

    spyOn(location, "back").and.stub();
    spyOn(location, "getState").and.callFake(() => ({
      // Default to no history (navigationId = 1)
      navigationId: navigationId ?? 1,
    }));

    accountSpy.updateContactableConcent = jasmine
      .createSpy("updateContactableConcent")
      .and.callThrough();
    accountSpy.update = jasmine.createSpy("update").and.callThrough();
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
      setup(testApiConfig.endpoints.apiRoot + "/broken_link");
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

      communicationsConcentToast().open = jasmine
        .createSpy("open")
        .and.callThrough();
    });

    describe("prompting conditions", () => {
      xit("should show a toast asking to opt-in to communications if they have not been asked", () => {
        isContactable(UserConcent.unasked);
        spec.component.submit({ login: "username", password: "password" });
        spec.detectChanges();

        expect(communicationsConcentToast().open).toHaveBeenCalledTimes(1);
      });

      it("should not show a toast if they have given a 'no' response", () => {
        isContactable(UserConcent.no);
        spec.component.submit({ login: "username", password: "password" });
        spec.detectChanges();

        expect(communicationsConcentToast().open).not.toHaveBeenCalled();
      });

      it("should not show a toast if they have given a 'yes' response", () => {
        isContactable(UserConcent.yes);
        spec.component.submit({ login: "username", password: "password" });
        spec.detectChanges();

        expect(communicationsConcentToast().open).not.toHaveBeenCalled();
      });

      it("should not show a toast if the user logs in with incorrect credentials", async () => {
        const errorPromise = setLoginError();

        // we set the contactable property to "unasked" so that if the
        isContactable(UserConcent.unasked);
        spec.component.submit({ login: "username", password: "password" });
        spec.detectChanges();

        await errorPromise;

        expect(communicationsConcentToast().open).not.toHaveBeenCalled();
      });
    });

    describe("capturing responses", () => {
      it("should update the session model correctly after changing communications concent", () => {
        // After opting into communications, we should see that the sessions
        // user model is correctly updated with the new communications concent
        // value.
        clickButton(spec, communicationsYesButton());

        expect(session.currentUser).toContain({
          communications: UserConcent.yes,
        });
      });

      it("should not make any api calls if the toast is dismissed without a response", () => {
        clickButton(spec, communicationsDismissButton());
        expect(accountSpy.update).not.toHaveBeenCalled();
      });

      it("should make the correct api calls for a 'yes' response", () => {
        clickButton(spec, communicationsYesButton());

        expect(accountSpy.update).toHaveBeenCalledOnceWith(
          jasmine.objectContaining<User>({
            id: session.currentUser.id,
            contactable: UserConcent.yes,
          })
        );
      });

      it("should make the correct api calls for a 'no' response", () => {
        clickButton(spec, communicationsNoButton());

        expect(accountSpy.update).toHaveBeenCalledOnceWith(
          jasmine.objectContaining<User>({
            id: session.currentUser.id,
            contactable: UserConcent.yes,
          })
        );
      });
    });
  });
});
