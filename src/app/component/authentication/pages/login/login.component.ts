import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";

import { AnyMenuItem, MenuRoute } from "src/app/interfaces/menus.interfaces";
import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { SecurityService } from "src/app/services/baw-api/security.service";
import {
  confirmAccountMenuItem, loginMenuItem, resetPasswordMenuItem, securityCategory, unlockAccountMenuItem } from "../../authentication.menus";

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
      [schema]="schemaUrl"
      [title]="'Log in'"
      [error]="error"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class LoginComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/login.json";
  error: string;
  loading: boolean;

  constructor(private api: SecurityService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    this.api.login($event).subscribe(data => {
      if (typeof data === "string") {
        this.error = data;
      } else {
        this.router.navigate(["/"]);
      }

      this.loading = false;
    });
  }
}
