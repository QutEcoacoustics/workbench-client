import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "lock-open"],
  label: "Unlock account",
  category: securityCategory,
  routeFragment: "unlock",
  tooltip: () => "Send an email to unlock your account",
  menus: null,
  order: { priority: 2, indentation: 1 }
})
@Component({
  selector: "app-confirm-account",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Resend unlock instructions'"
      [submitLabel]="'Resend unlock instructions'"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class UnlockPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/unlock-account.json";
  error: string;

  constructor() {
    super();
  }

  ngOnInit() {}

  submit(model) {
    console.log(model);
  }
}
