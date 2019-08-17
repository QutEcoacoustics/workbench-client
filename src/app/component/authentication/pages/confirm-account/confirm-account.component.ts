import { Component, OnInit } from "@angular/core";

import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { confirmAccountMenuItem, securityCategory } from "../../authentication.menus";

@Page({
  category: securityCategory,
  menus: null,
  self: confirmAccountMenuItem,
})
@Component({
  selector: "app-confirm-account",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Resend confirmation instructions?'"
      [submitLabel]="'Resend confirmation instructions'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ConfirmPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/confirm-account.json";
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
