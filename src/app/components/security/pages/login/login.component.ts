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
      [title]="'Subscribe to communications'"
      [options]="{ autoHide: false }"
    >
      <ng-template>
        <p>Would you like to subscribe to communications?</p>

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
        if (this.redirectBack) {
          this.location.back();
        } else if (this.redirectUrl instanceof StrongRoute) {
          this.router.navigateByUrl(this.redirectUrl.toRouterLink());
        } else if (this.redirectUrl.startsWith("/")) {
          this.router.navigateByUrl(this.redirectUrl);
        } else {
          this.notifications.error("Unable to redirect back to previous page");
        }
      },
      onSuccess: () => {
        this.communicationsToastElement.open();
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
      this.accountsApi.optInContactable(this.session.currentUser.id)
    );
  }

  protected optOutContactable() {
    this.communicationsToastElement.close();
    firstValueFrom(
      this.accountsApi.optOutContactable(this.session.currentUser.id)
    );
  }
}

LoginComponent.linkToRoute({
  category: securityCategory,
  pageRoute: loginMenuItem,
  menus: { actions: List(loginMenuItemActions) },
});

export { LoginComponent };
