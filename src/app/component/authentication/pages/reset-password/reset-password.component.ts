import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem
} from "../../authentication.menus";
import data from "./reset-password.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      resetPasswordMenuItem,
      confirmAccountMenuItem,
      unlockAccountMenuItem,
      loginMenuItem
    ]),
    links: List()
  },
  self: resetPasswordMenuItem
})
@Component({
  selector: "app-reset-password",
  template: `
    <app-form
      [schema]="schema"
      [title]="'Forgot your password?'"
      [submitLabel]="'Send me reset password instructions'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class ResetPasswordComponent extends PageComponent implements OnInit {
  schema = data;
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
