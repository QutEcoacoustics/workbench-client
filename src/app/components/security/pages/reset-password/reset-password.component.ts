import { Component, inject } from "@angular/core";
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
import { FormComponent } from "@shared/form/form.component";
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
  imports: [FormComponent],
})
class ResetPasswordComponent extends FormTemplate<ResetPassword> {
  private readonly api = inject(UserService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      successMsg: () =>
        "If your user account exists in our database, " +
        "a password recovery link will be sent to your email address.",
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
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
