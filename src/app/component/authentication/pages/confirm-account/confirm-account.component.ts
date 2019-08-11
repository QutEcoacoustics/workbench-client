import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import { MakeRoute } from "src/app/interfaces/Routing";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "envelope"],
  label: "Confirm account",
  category: securityCategory,
  route: MakeRoute("security", "confirmation"),
  tooltip: () => "Resend the email to confirm your account",
  menus: null,
  order: { priority: 2, indentation: 1 }
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
