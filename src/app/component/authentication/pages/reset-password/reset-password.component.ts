import { Component, OnInit } from "@angular/core";

import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { resetPasswordMenuItem, securityCategory } from "../../authentication.menus";

@Page({
  category: securityCategory,
  menus: null,
  self: resetPasswordMenuItem
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
