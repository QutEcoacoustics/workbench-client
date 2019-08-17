import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";

import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/menus.interfaces";
import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { SecurityService } from "src/app/services/baw-api/security.service";
import {
  confirmAccountMenuItem, loginMenuItem, resetPasswordMenuItem, securityCategory, unlockAccountMenuItem } from "../../authentication.menus";
import data from "./login.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      resetPasswordMenuItem,
      confirmAccountMenuItem,
      unlockAccountMenuItem,
      loginMenuItem
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
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class LoginComponent extends PageComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  schema = data;
  error: string;
  loading: boolean;

  constructor(
    private api: SecurityService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
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
    this.ref.detectChanges();

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
