import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { homeMenuItem } from "src/app/component/home/home.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { SecurityService } from "src/app/services/baw-api/security.service";
import url from "url";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem
} from "../../security.menus";
import data from "./login.json";

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
  public schema = data;
  public error: string;
  public errorDetails: APIErrorDetails;
  public loading: boolean;
  public redirectUrl: string;
  private unsubscribe = new Subject();

  constructor(
    private api: SecurityService,
    private config: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.redirectUrl = homeMenuItem.route.toString();
    const msg = "You are already logged in";

    if (this.api.isLoggedIn()) {
      this.loading = true;
      this.error = msg;
    } else {
      this.loading = false;

      if (this.error === msg) {
        this.error = null;
      }
    }

    // Update redirect url
    this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(
      params => {
        const redirect: string = params.redirect;
        if (redirect) {
          const redirectUrl = url.parse(redirect);
          const validUrl = url.parse(
            this.config.getConfig().environment.apiRoot
          );

          if (
            redirect.charAt(0) === "/" ||
            redirectUrl.href === validUrl.href
          ) {
            this.redirectUrl = redirect;
          }
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
      .signIn($event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.router.navigateByUrl(this.redirectUrl);
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
