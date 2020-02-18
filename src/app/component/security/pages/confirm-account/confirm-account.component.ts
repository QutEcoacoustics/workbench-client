import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem
} from "../../security.menus";
import data from "./confirm-account.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      loginMenuItem,
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem
    ]),
    links: List()
  },
  canDeactivate: true,
  self: confirmAccountMenuItem
})
@Component({
  selector: "app-confirm-account",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'Resend confirmation instructions?'"
        [submitLabel]="'Resend confirmation instructions'"
        [submitLoading]="loading"
        [error]="error"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
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
