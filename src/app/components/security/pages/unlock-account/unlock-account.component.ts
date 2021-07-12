import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import {
  loginMenuItem,
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { IUnlockAccount, UnlockAccount } from "@models/data/UnlockAccount";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { loginMenuItemActions } from "../login/login.component";
import schema from "./unlock-account.schema.json";

@Component({
  selector: "baw-confirm-account",
  template: `
    <baw-form
      title="Resend unlock instructions"
      [model]="model"
      [fields]="fields"
      submitLabel="Resend unlock instructions"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class UnlockAccountComponent extends FormTemplate<UnlockAccount> {
  public fields = schema.fields;

  public constructor(
    private api: SecurityService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: () =>
        "If your user account exists in our database, " +
        "you will receive an email with instructions about how to unlock it in a few minutes.",
    });
  }

  protected apiAction(model: IUnlockAccount) {
    return this.api.unlockAccount(new UnlockAccount(model));
  }
}

UnlockAccountComponent.linkComponentToPageInfo({
  category: securityCategory,
  menus: { actions: List([loginMenuItem, ...loginMenuItemActions]) },
}).andMenuRoute(unlockAccountMenuItem);

export { UnlockAccountComponent };
