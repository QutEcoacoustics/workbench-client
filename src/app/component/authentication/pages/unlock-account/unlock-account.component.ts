import { Component, OnInit } from "@angular/core";

import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { securityCategory, unlockAccountMenuItem } from "../../authentication.menus";

@Page({
  category: securityCategory,
  menus: null,
  self: unlockAccountMenuItem
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
