import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";

import { AnyMenuItem } from "src/app/interfaces/layout-menus.interfaces";
import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { BawApiService } from "src/app/services/baw-api/baw-api.service";
import { securityCategory } from "../../authentication";
import { ConfirmPasswordComponent } from "../confirm-account/confirm-account.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

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
      {
        kind: "MenuAction",
        icon: ["fas", "lock-open"],
        label: "Unlock account",
        tooltip: () => "Send an email to unlock your account",
        action: () => console.log("Unlock account")
      }
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
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class LoginComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/login.json";
  error: string;

  constructor(private api: BawApiService, private router: Router) {
    super();
  }

  ngOnInit() {}

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.api.login($event).subscribe(data => {
      if (typeof data === "string") {
        this.error = data;
      } else {
        this.router.navigate(["/"]);
      }
    });
  }
}
