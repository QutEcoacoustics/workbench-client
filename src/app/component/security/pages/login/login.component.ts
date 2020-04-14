import { DOCUMENT, Location } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginDetails, SecurityService } from "@baw-api/security.service";
import { homeMenuItem } from "@component/home/home.menus";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@component/security/security.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import url from "url";
import { fields } from "./login.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem,
    ]),
    links: List(),
  },
  self: loginMenuItem,
})
@Component({
  selector: "app-authentication-login",
  template: `
    <app-form
      *ngIf="!failure"
      title="Log in"
      size="small"
      [model]="model"
      [fields]="fields"
      submitLabel="Log in"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `,
})
export class LoginComponent extends FormTemplate<LoginDetails>
  implements OnInit {
  public fields = fields;
  private redirectBack: boolean;
  private redirectUrl: string;

  constructor(
    @Inject(API_ROOT) private apiRoot: string,
    @Inject(DOCUMENT) private document: Document,
    private api: SecurityService,
    private location: Location,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      () => "Successfully signed in",
      defaultErrorMsg,
      false
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.api.isLoggedIn()) {
      this.notifications.error("You are already logged in.");
    }

    this.redirectUrl = homeMenuItem.route.toString();
    const noHistory = 1;
    const navigationId = (this.location.getState() as any).navigationId;
    const redirect: string | boolean | undefined = this.route.snapshot
      .queryParams.redirect;

    // If no redirect, redirect home
    if (redirect === false) {
      this.redirectUrl = homeMenuItem.route.toString();
      return;
    }

    // If external redirect
    if (typeof redirect === "string") {
      const redirectUrl = url.parse(redirect);
      const validUrl = url.parse(this.apiRoot);

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

  protected redirectUser() {
    if (this.redirectBack) {
      this.location.back();
    } else if (this.redirectUrl.startsWith("/")) {
      this.router.navigateByUrl(this.redirectUrl);
    } else {
      this.externalRedirect(this.redirectUrl);
    }
  }

  protected apiAction(model: Partial<LoginDetails>) {
    return this.api.signIn(new LoginDetails(model));
  }

  /**
   * Redirect to an external website.
   * ! Do not change, this is inside a function to stop unit tests from redirecting
   * TODO Remove this once website is entirely moved to workbench-client
   * @param redirect Redirect url
   */
  public externalRedirect(redirect: string) {
    this.document.location.href = redirect;
  }
}
