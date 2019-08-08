import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "envelope"],
  label: "Confirm account",
  category: securityCategory,
  routeFragment: "confirmation",
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
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ConfirmPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/confirm-account.json";
  error: string;

  constructor() {
    super();
  }

  ngOnInit() {}

  submit(model) {
    console.log(model);
  }
}
