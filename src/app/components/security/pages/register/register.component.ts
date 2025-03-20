import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { homeMenuItem } from "@components/home/home.menus";
import {
  registerMenuItem,
  securityCategory,
} from "@components/security/security.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import {
  IRegisterDetails,
  RegisterDetails,
} from "@models/data/RegisterDetails";
import { RecaptchaState } from "@shared/form/form.component";
import { takeUntil } from "rxjs/operators";
import { ToastsService } from "@services/toasts/toasts.service";
import schema from "./register.schema.json";

@Component({
  selector: "baw-authentication-register",
  template: `
    <baw-form
      title="Register"
      size="small"
      [model]="model"
      [fields]="fields"
      submitLabel="Register"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class RegisterComponent
  extends FormTemplate<RegisterDetails>
  implements OnInit
{
  public fields = schema.fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };

  public constructor(
    private securityApi: SecurityService,
    private session: BawSessionService,
    protected notifications: ToastsService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      hasFormCheck: false,
      successMsg: () => "Successfully registered new account",
      redirectUser: () =>
        this.router.navigateByUrl(homeMenuItem.route.toRouterLink()),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.session.isLoggedIn) {
      // Disable submit button
      this.loading = true;
      this.notifications.error("You are already logged in.");
      return;
    }

    this.securityApi
      .signUpSeed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: ({ seed, action }) =>
          (this.recaptchaSeed = { state: "loaded", seed, action }),
        error: (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        },
      });
  }

  protected apiAction(model: IRegisterDetails) {
    return this.securityApi.signUp(new RegisterDetails(model));
  }
}

RegisterComponent.linkToRoute({
  category: securityCategory,
  pageRoute: registerMenuItem,
});

export { RegisterComponent };
