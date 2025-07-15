import { Location } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { homeMenuItem } from "@components/home/home.menus";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { StrongRoute } from "@interfaces/strongRoute";
import { ILoginDetails, LoginDetails } from "@models/data/LoginDetails";
import { API_ROOT } from "@services/config/config.tokens";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { ToastComponent } from "@shared/toast/toast.component";
import { AccountsService } from "@baw-api/account/accounts.service";
import { firstValueFrom } from "rxjs";
import { UserConcent } from "@interfaces/apiInterfaces";
import { FormComponent } from "@shared/form/form.component";
import schema from "./login.schema.json";

export const loginMenuItemActions = [
  confirmAccountMenuItem,
  resetPasswordMenuItem,
  unlockAccountMenuItem,
];

@Component({
  selector: "baw-authentication-login",
  template: `
    <baw-form
      title="Log in"
      size="small"
      [model]="model"
      [fields]="fields"
      submitLabel="Log in"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    ></baw-form>

    <baw-toast
      #communicationsToast
      [title]="'Subscribe to email updates'"
      [options]="{ autoHide: false }"
    >
      <ng-template>
        <p>Can we email you with updates to our platform?</p>

        <div class="d-flex justify-content-end">
          <button class="btn btn-primary me-2" (click)="optInContactable()">
            Yes
          </button>

          <button
            class="btn btn-danger text-white"
            (click)="optOutContactable()"
          >
            No
          </button>
        </div>
      </ng-template>
    </baw-toast>
  `,
  imports: [FormComponent, ToastComponent],
})
class LoginComponent extends FormTemplate<LoginDetails> implements OnInit {
  public fields = schema.fields;
  private redirectBack: boolean;
  private redirectUrl: string | StrongRoute;

  @ViewChild("communicationsToast")
  private communicationsToastElement: ToastComponent;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private securityApi: SecurityService,
    private session: BawSessionService,
    private location: Location,
    private accountsApi: AccountsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      hasFormCheck: false,
      successMsg: () => "Successfully signed in",
      redirectUser: () => {
        // The order of these if conditions is important.
        // If the redirect url is a string, it has been passed into this
        // component through the "redirect" url parameter, the typeof
        // redirecturl will be a string.
        // If the redirectUrl is a StrongRoute, it is a fallback url defined
        // inside this component (there is no way to pass a strong route into
        // this component).
        // We therefore, only use the StrongRoute as a last resort.
        if (typeof this.redirectUrl === "string" && this.redirectUrl.startsWith("/")) {
          this.router.navigateByUrl(this.redirectUrl);
        } else if (this.redirectBack) {
          this.location.back();
        } else if (this.redirectUrl instanceof StrongRoute) {
          this.router.navigateByUrl(this.redirectUrl.toRouterLink());
        } else {
          this.notifications.error("Unable to redirect back to previous page");
        }
      },
      onSuccess: () => {
        // When logging in we check to see if the user has been asked to opt in
        // to communications.
        // If they have never been asked, we show a toast asking if they would
        // like to opt in.
        //
        // Although we ask the user to opt in/out of communications are
        // registration, we have a backlog of users who have not been asked
        // before.
        //
        // the onSuccess callback is executed before the redirectUser callback
        // meaning that this component can create the toast before the user is
        // redirected.
        if (this.session.isContactable === UserConcent.unasked) {
          this.communicationsToastElement.open();
        }
      },
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.session.isLoggedIn) {
      this.notifications.error("You are already logged in.");
    }

    this.redirectUrl = homeMenuItem.route;
    const noHistory = 1;
    const navigationId =
      (this.location.getState() as any)?.navigationId ?? noHistory;
    const redirect: string | boolean = this.route.snapshot.queryParams.redirect;

    // If no redirect, redirect home
    if (typeof redirect === "boolean" && !redirect) {
      this.redirectUrl = homeMenuItem.route;
      return;
    }

    // If external redirect
    if (typeof redirect === "string") {
      const redirectUrl = new URL(redirect, window.location.origin);
      const validUrl = new URL(this.apiRoot, window.location.origin);

      // Check if redirect url is safe
      if (
        redirect.startsWith("/") ||
        redirectUrl.protocol + "//" + redirectUrl.hostname ===
          validUrl.protocol + "//" + validUrl.hostname
      ) {
        this.redirectUrl = redirect;
      }
    }

    // Redirect to previous page unless there is no router history
    if (navigationId !== noHistory) {
      this.redirectBack = true;
    }
  }

  protected apiAction(model: ILoginDetails) {
    return this.securityApi.signIn(new LoginDetails(model));
  }

  protected optInContactable() {
    this.communicationsToastElement.close();
    firstValueFrom(
      this.accountsApi.optInContactable(this.session.loggedInUser.id)
    );
  }

  protected optOutContactable() {
    this.communicationsToastElement.close();
    firstValueFrom(
      this.accountsApi.optOutContactable(this.session.loggedInUser.id)
    );
  }
}

LoginComponent.linkToRoute({
  category: securityCategory,
  pageRoute: loginMenuItem,
  menus: { actions: List(loginMenuItemActions) },
});

export { LoginComponent };
