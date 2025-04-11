import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "@baw-api/user/user.service";
import { confirmAccountMenuItem, securityCategory } from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { ConfirmPassword, IConfirmPassword } from "@models/data/ConfirmPassword";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { loginMenuItemActions } from "../login/login.component";
import { FormComponent } from "../../../shared/form/form.component";
import schema from "./confirm-account.schema.json";

@Component({
  selector: "baw-confirm-account",
  template: `
    <baw-form
      title="Resend confirmation instructions?"
      [model]="model"
      [fields]="fields"
      submitLabel="Resend confirmation instructions"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
  imports: [FormComponent],
})
class ConfirmPasswordComponent extends FormTemplate<ConfirmPassword> {
  public fields = schema.fields;

  public constructor(
    private api: UserService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    super(notifications, route, router, {
      successMsg: () =>
        "If your user account exists in our database, " +
        "you will receive an email with instructions about how to confirm your account in a few minutes.",
    });
  }

  protected apiAction(model: IConfirmPassword) {
    return this.api.confirmPassword(new ConfirmPassword(model));
  }
}

ConfirmPasswordComponent.linkToRoute({
  category: securityCategory,
  pageRoute: confirmAccountMenuItem,
  menus: { actions: List(loginMenuItemActions) },
});

export { ConfirmPasswordComponent };
