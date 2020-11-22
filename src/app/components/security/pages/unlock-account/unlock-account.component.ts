import { Component, OnInit } from "@angular/core";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { fields } from "./unlock-account.schema.json";

@Component({
  selector: "baw-confirm-account",
  template: `
    <baw-wip>
      <baw-form
        title="Resend unlock instructions"
        [model]="model"
        [fields]="fields"
        submitLabel="Resend unlock instructions"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class UnlockAccountComponent
  extends WithFormCheck(PageComponent)
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

UnlockAccountComponent.LinkComponentToPageInfo({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      loginMenuItem,
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem,
    ]),
  },
}).AndMenuRoute(unlockAccountMenuItem);

export { UnlockAccountComponent };
