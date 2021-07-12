import { Location } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import { homeMenuItem } from "@components/home/home.menus";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { StrongRoute } from "@interfaces/strongRoute";
import { ILoginDetails, LoginDetails } from "@models/data/LoginDetails";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
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
  `,
})
class LoginComponent extends FormTemplate<LoginDetails> implements OnInit {
  public fields = schema.fields;
  private redirectBack: boolean;
  private redirectUrl: string | StrongRoute;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private api: SecurityService,
    private location: Location,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
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
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.api.isLoggedIn()) {
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
    return this.api.signIn(new LoginDetails(model));
  }
}

LoginComponent.linkComponentToPageInfo({
  category: securityCategory,
  menus: { actions: List(loginMenuItemActions) },
}).andMenuRoute(loginMenuItem);

export { LoginComponent };
