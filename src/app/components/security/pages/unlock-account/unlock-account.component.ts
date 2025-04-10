import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "@baw-api/user/user.service";
import {
  securityCategory,
  unlockAccountMenuItem,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { IUnlockAccount, UnlockAccount } from "@models/data/UnlockAccount";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { loginMenuItemActions } from "../login/login.component";
import schema from "./unlock-account.schema.json";
import { FormComponent } from "../../../shared/form/form.component";

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
    imports: [FormComponent]
})
class UnlockAccountComponent extends FormTemplate<UnlockAccount> {
  public fields = schema.fields;

  public constructor(
    private api: UserService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
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

UnlockAccountComponent.linkToRoute({
  category: securityCategory,
  pageRoute: unlockAccountMenuItem,
  menus: { actions: List(loginMenuItemActions) },
});

export { UnlockAccountComponent };
