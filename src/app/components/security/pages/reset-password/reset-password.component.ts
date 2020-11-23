import { Component, OnInit } from "@angular/core";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { fields } from "./reset-password.schema.json";

@Component({
  selector: "baw-reset-password",
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
class ResetPasswordComponent
  extends withFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  public constructor() {
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

ResetPasswordComponent.linkComponentToPageInfo({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      loginMenuItem,
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem,
    ]),
  },
}).andMenuRoute(resetPasswordMenuItem);

export { ResetPasswordComponent };
