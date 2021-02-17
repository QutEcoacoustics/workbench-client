import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IRegisterDetails,
  RegisterDetails,
  SecurityService,
} from "@baw-api/security/security.service";
import {
  registerMenuItem,
  securityCategory,
} from "@components/security/security.menus";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
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
      [seed]="seed"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class RegisterComponent
  extends FormTemplate<RegisterDetails>
  implements OnInit {
  public fields = fields;
  public loading: boolean;
  public seed: string | boolean = true;

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
        (seed) => (this.seed = seed),
        (err) => console.error(err)
      );
  }

  protected apiAction(model: IRegisterDetails) {
    return this.api.signUp(new RegisterDetails(model));
  }
}

RegisterComponent.linkComponentToPageInfo({
  category: securityCategory,
}).andMenuRoute(registerMenuItem);

export { RegisterComponent };
