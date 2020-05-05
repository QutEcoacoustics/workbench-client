import { Component, OnInit } from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
import {
  registerMenuItem,
  securityCategory,
} from "@component/security/security.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { ToastrService } from "ngx-toastr";
import { fields } from "./register.json";

@Page({
  category: securityCategory,
  menus: null,
  self: registerMenuItem,
})
@Component({
  selector: "app-authentication-register",
  template: `
    <app-wip>
      <app-form
        title="Register"
        size="small"
        [model]="model"
        [fields]="fields"
        submitLabel="Register"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `,
})
export class RegisterComponent extends PageComponent implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  constructor(
    private api: SecurityService,
    private notifications: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    if (this.api.isLoggedIn()) {
      // Disable submit button
      this.loading = true;
      this.notifications.error("You are already logged in.");
    }
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
