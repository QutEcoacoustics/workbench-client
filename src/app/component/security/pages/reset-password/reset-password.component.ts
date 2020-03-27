import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { WithFormCheck } from "src/app/guards/form/form.guard";
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
import { fields } from "./reset-password.json";

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
  self: resetPasswordMenuItem
})
@Component({
  selector: "app-reset-password",
  template: `
    <app-wip>
      <app-form
        title="Forgot your password?"
        [model]="model"
        [fields]="fields"
        submitLabel="Send me reset password instructions"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class ResetPasswordComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

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
