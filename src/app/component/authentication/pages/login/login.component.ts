import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";

import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/layout-menus.interfaces";
import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { securityCategory } from "../../authentication";
import { ConfirmPasswordComponent } from "../confirm-account/confirm-account.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { UnlockPasswordComponent } from "../unlock-account/unlock-account.component";

@Page({
  icon: ["fas", "sign-in-alt"],
  label: "Log in",
  category: securityCategory,
  routeFragment: "login",
  tooltip: () => "Log into the website",
  predicate: user => !user,
  order: { priority: 2, indentation: 0 },
  menus: {
    actions: List<AnyMenuItem>([
      ResetPasswordComponent.pageInfo,
      ConfirmPasswordComponent.pageInfo,
      UnlockPasswordComponent.pageInfo
    ]),
    links: null
  }
})
@Component({
  selector: "app-authentication-login",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Log in'"
      [error]="error"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class LoginComponent extends PageComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  schemaUrl = "assets/templates/login.json";
  error: string;
  loading: boolean;

  constructor(private api: SecurityService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.subs.sink = this.api.getLoggedInTrigger().subscribe(loggedIn => {
      const msg = "You are already logged in";

      if (loggedIn) {
        this.loading = true;
        this.error = msg;
      } else {
        this.loading = false;

        if (this.error === msg) {
          this.error = null;
        }
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    this.api.login($event).subscribe(
      () => {
        this.router.navigate(["/"]);
        this.loading = false;
      },
      err => {
        this.error = err;
        this.loading = false;
      }
    );
  }
}
