import { Component, OnInit } from "@angular/core";

import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { confirmAccountMenuItem, securityCategory } from "../../authentication.menus";
import data from "./confirm-account.json";

@Page({
  category: securityCategory,
  menus: null,
  self: confirmAccountMenuItem,
})
@Component({
  selector: "app-confirm-account",
  template: `
    <app-form
      [schema]="schema"
      [title]="'Resend confirmation instructions?'"
      [submitLabel]="'Resend confirmation instructions'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ConfirmPasswordComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
  loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
