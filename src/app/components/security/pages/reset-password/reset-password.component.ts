import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "@baw-api/user/user.service";
import {
  resetPasswordMenuItem,
  securityCategory,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { IResetPassword, ResetPassword } from "@models/data/ResetPassword";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { loginMenuItemActions } from "../login/login.component";
import { FormComponent } from "../../../shared/form/form.component";
import schema from "./reset-password.schema.json";

@Component({
  selector: "baw-reset-password",
  template: `
    <baw-form
      title="Forgot your password?"
      [model]="model"
      [fields]="fields"
      submitLabel="Send me reset password instructions"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
  imports: [FormComponent],
})
class ResetPasswordComponent extends FormTemplate<ResetPassword> {
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
        "a password recovery link will be sent to your email address.",
    });
  }

  protected apiAction(model: IResetPassword) {
    return this.api.resetPassword(new ResetPassword(model));
  }
}

ResetPasswordComponent.linkToRoute({
  category: securityCategory,
  pageRoute: resetPasswordMenuItem,
  menus: { actions: List(loginMenuItemActions) },
});

export { ResetPasswordComponent };
