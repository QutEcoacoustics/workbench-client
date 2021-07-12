import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import {
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { IResetPassword, ResetPassword } from "@models/data/ResetPassword";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { loginMenuItemActions } from "../login/login.component";
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
})
class ResetPasswordComponent extends FormTemplate<ResetPassword> {
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
        "a password recovery link will be sent to your email address.",
    });
  }

  protected apiAction(model: IResetPassword) {
    return this.api.resetPassword(new ResetPassword(model));
  }
}

ResetPasswordComponent.linkComponentToPageInfo({
  category: securityCategory,
  menus: { actions: List([loginMenuItem, ...loginMenuItemActions]) },
}).andMenuRoute(resetPasswordMenuItem);

export { ResetPasswordComponent };
