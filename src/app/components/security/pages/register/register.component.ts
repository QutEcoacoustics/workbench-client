import { Component, OnInit, inject } from "@angular/core";
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
import { RecaptchaState , FormComponent } from "@shared/form/form.component";
import { catchError, concatMap, endWith, ignoreElements, takeUntil } from "rxjs/operators";
import { ToastService } from "@services/toasts/toasts.service";
import { AuthRedirectService } from "@services/security/auth-redirect.service";
import { AccountsService } from "@baw-api/account/accounts.service";
import { of } from "rxjs";
import { UserConcent } from "@interfaces/apiInterfaces";
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
  imports: [FormComponent],
})
class RegisterComponent
  extends FormTemplate<RegisterDetails>
  implements OnInit
{
  private readonly securityApi = inject(SecurityService);
  private readonly session = inject(BawSessionService);
  private readonly accountsApi = inject(AccountsService);
  private readonly authRedirect = inject(AuthRedirectService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      hasFormCheck: false,
      successMsg: () => "Successfully registered new account",
      redirectUser: () => {
        if (this.authRedirect.redirect(this.route.snapshot.queryParams.redirect)) {
          return;
        }
        this.router.navigateByUrl(homeMenuItem.route.toRouterLink());
      },
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
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
    return this.securityApi
      .signUp(new RegisterDetails(model))
      .pipe(
        concatMap(() =>
          this.accountsApi.updateContactableConcent(
            this.session.currentUser.id,
            model.contactable ? UserConcent.yes : UserConcent.no
          ).pipe(
            ignoreElements(),
            endWith(undefined),
            catchError(() => {
              this.notifications.error("Account created, but your email preference could not be saved.");
              return of(undefined);
            })
          )
        )
      );
  }
}

RegisterComponent.linkToRoute({
  category: securityCategory,
  pageRoute: registerMenuItem,
});

export { RegisterComponent };
