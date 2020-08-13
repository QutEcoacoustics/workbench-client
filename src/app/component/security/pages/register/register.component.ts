import { Component, OnInit } from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
import {
  registerMenuItem,
  securityCategory,
} from "@component/security/security.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { ToastrService } from "ngx-toastr";
import { fields } from "./register.schema.json";

@Component({
  selector: "app-authentication-register",
  template: `
    <baw-wip>
      <baw-form
        title="Register"
        size="small"
        [model]="model"
        [fields]="fields"
        submitLabel="Register"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class RegisterComponent extends PageComponent implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  constructor(
    private api: SecurityService,
    private notifications: ToastrService
  ) {
    super();
  }

  public ngOnInit() {
    if (this.api.isLoggedIn()) {
      // Disable submit button
      this.loading = true;
      this.notifications.error("You are already logged in.");
    }
  }

  public submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}

RegisterComponent.WithInfo({
  category: securityCategory,
  self: registerMenuItem,
});

export { RegisterComponent };
