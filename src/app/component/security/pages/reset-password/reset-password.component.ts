import { Component, OnInit } from "@angular/core";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@component/security/security.menus";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { fields } from "./reset-password.schema.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      loginMenuItem,
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem,
    ]),
    links: List(),
  },
  self: resetPasswordMenuItem,
})
@Component({
  selector: "app-reset-password",
  template: `
    <baw-wip>
      <baw-form
        title="Forgot your password?"
        [model]="model"
        [fields]="fields"
        submitLabel="Send me reset password instructions"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
export class ResetPasswordComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  constructor() {
    super();
  }

  public ngOnInit() {
    this.loading = false;
  }

  public submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
