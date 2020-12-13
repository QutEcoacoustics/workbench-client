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
import { List } from "immutable";
import { fields } from "./confirm-account.schema.json";

@Component({
  selector: "baw-confirm-account",
  template: `
    <baw-wip>
      <baw-form
        title="Resend confirmation instructions?"
        [model]="model"
        [fields]="fields"
        submitLabel="Resend confirmation instructions"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class ConfirmPasswordComponent
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

  public submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}

ConfirmPasswordComponent.linkComponentToPageInfo({
  category: securityCategory,
  menus: {
    actions: List([
      loginMenuItem,
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem,
    ]),
  },
}).andMenuRoute(confirmAccountMenuItem);

export { ConfirmPasswordComponent };
