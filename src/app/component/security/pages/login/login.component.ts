import { DOCUMENT, Location } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { homeMenuItem } from "src/app/component/home/home.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
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
      [title]="'Log in'"
      [error]="error"
      [submitLabel]="'Log in'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class LoginComponent extends PageComponent implements OnInit, OnDestroy {
  public schema = { model: {}, fields };
  public error: string;
  public errorDetails: ApiErrorDetails;
  public loading: boolean;
  private redirectUrl: string;
  private redirectBack: boolean;
  private unsubscribe = new Subject();

  constructor(
    private api: SecurityService,
    private config: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;
    this.redirectUrl = homeMenuItem.route.toString();
    const noHistory = 1;
    const state: LocationState = this.location.getState() as LocationState;

    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params: { redirect: string | boolean | undefined }) => {
        const redirect = params.redirect;

        // If no redirect, redirect home
        if (redirect === false) {
          this.redirectUrl = homeMenuItem.route.toString();
          return;
        }

        // If external redirect
        if (typeof redirect === "string") {
          const redirectUrl = url.parse(redirect);
          const validUrl = url.parse(
            this.config.getConfig().environment.apiRoot
          );

          // Check if redirect url is safe
          if (
            redirect.charAt(0) === "/" ||
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
      },
      err => {}
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    this.ref.detectChanges();

    this.api
      .signIn(new LoginDetails($event))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          if (this.redirectBack) {
            this.location.back();
          } else if (this.redirectUrl.charAt(0) === "/") {
            this.router.navigateByUrl(this.redirectUrl);
          } else {
            this.externalRedirect(this.redirectUrl);
          }

          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.error = err.message;
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
