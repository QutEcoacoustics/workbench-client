import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IRegisterDetails,
  RegisterDetails,
  SecurityService,
} from "@baw-api/security/security.service";
import { homeMenuItem } from "@components/home/home.menus";
import {
  registerMenuItem,
  securityCategory,
} from "@components/security/security.menus";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { RecaptchaState } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { fields } from "./register.schema.json";

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
  implements OnInit {
  public fields = fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };

  public constructor(
    private api: SecurityService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      () => "Successfully registered new account",
      defaultErrorMsg,
      false
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.api.isLoggedIn()) {
      // Disable submit button
      this.loading = true;
      this.notifications.error("You are already logged in.");
      return;
    }

    this.api
      .signUpSeed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (seed) => (this.recaptchaSeed = { state: "loaded", seed }),
        (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        }
      );
  }

  protected apiAction(model: IRegisterDetails) {
    return this.api.signUp(new RegisterDetails(model));
  }

  protected redirectionPath(): string {
    return homeMenuItem.route.toRouterLink();
  }
}

RegisterComponent.linkComponentToPageInfo({
  category: securityCategory,
}).andMenuRoute(registerMenuItem);

export { RegisterComponent };
