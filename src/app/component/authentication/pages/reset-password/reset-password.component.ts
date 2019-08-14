import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/page.decorator";
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
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ResetPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/forgot-password.json";
  error: string;
  loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
