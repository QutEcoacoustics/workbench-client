import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/page.decorator";
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
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class UnlockPasswordComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/unlock-account.json";
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
