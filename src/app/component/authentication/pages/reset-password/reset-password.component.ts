import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "key"],
  label: "Reset password",
  category: securityCategory,
  routeFragment: "reset_password",
  tooltip: () => "Send an email to reset your password",
  menus: null,
  order: { priority: 2, indentation: 1 }
})
@Component({
  selector: "app-reset-password",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Forgot your password?'"
      [submitLabel]="'Send me reset password instructions'"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ResetPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/forgot-password.json";
  error: string;

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {}

  submit(model) {
    console.log(model);
  }
}
