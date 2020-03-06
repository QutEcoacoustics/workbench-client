import { DOCUMENT, Location } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { homeMenuItem } from "src/app/component/home/home.menus";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  LoginDetails,
  SecurityService
} from "src/app/services/baw-api/security.service";
import url from "url";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem
} from "../../security.menus";
import { fields } from "./login.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem
    ]),
    links: List()
  },
  self: loginMenuItem
})
@Component({
  selector: "app-authentication-login",
  template: `
    <app-form
      [schema]="schema"
      [size]="'small'"
      [title]="'Log in'"
      [submitLabel]="'Log in'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class LoginComponent extends PageComponent implements OnInit {
  public schema = { model: {}, fields };
  public loading: boolean;
  private redirectBack: boolean;
  private redirectUrl: string;

  constructor(
    @Inject(API_ROOT) private apiRoot: string,
    @Inject(DOCUMENT) private document: Document,
    private api: SecurityService,
    private location: Location,
    private notifications: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;
    this.redirectUrl = homeMenuItem.route.toString();
    const noHistory = 1;
    const state: LocationState = this.location.getState() as LocationState;

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
    if (state.navigationId !== noHistory) {
      this.redirectBack = true;
    }
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    this.api
      .signIn(new LoginDetails($event))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.notifications.success("Successfully signed in.");

          if (this.redirectBack) {
            this.location.back();
          } else if (this.redirectUrl.startsWith("/")) {
            this.router.navigateByUrl(this.redirectUrl);
          } else {
            this.externalRedirect(this.redirectUrl);
          }
        },
        (err: ApiErrorDetails) => {
          this.notifications.error(err.message);
          this.loading = false;
        }
      );
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

interface LocationState {
  navigationId: 1;
}
