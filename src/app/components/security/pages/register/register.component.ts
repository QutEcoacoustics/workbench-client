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
import { map, takeUntil } from "rxjs/operators";
import { ToastService } from "@services/toasts/toasts.service";
import { AccountsService } from "@baw-api/account/accounts.service";
import { firstValueFrom } from "rxjs";
import { UserConcent } from "@interfaces/apiInterfaces";
import { FormComponent } from "../../../shared/form/form.component";
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
    imports: [FormComponent]
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
    private accountsApi: AccountsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      hasFormCheck: false,
      successMsg: () => "Successfully registered new account",
      redirectUser: () => {
        this.router.navigateByUrl(homeMenuItem.route.toRouterLink());
      },
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
        next: ({ seed, action }) => {
          this.recaptchaSeed = { state: "loaded", seed, action };
        },
        error: (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        },
      });
  }

  protected apiAction(model: IRegisterDetails) {
    const signUpObservable = this.securityApi
      .signUp(new RegisterDetails(model))
      .pipe(
        map(() => {
          firstValueFrom(
            this.accountsApi.updateContactableConcent(
              this.session.currentUser.id,
              model.contactable ? UserConcent.yes : UserConcent.no
            )
          );
        })
      );

    return signUpObservable;
  }
}

RegisterComponent.linkToRoute({
  category: securityCategory,
  pageRoute: registerMenuItem,
});

export { RegisterComponent };
