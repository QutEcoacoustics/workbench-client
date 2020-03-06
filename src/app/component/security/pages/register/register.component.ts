import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { registerMenuItem, securityCategory } from "../../security.menus";
import { fields } from "./register.json";

@Page({
  category: securityCategory,
  menus: null,
  self: registerMenuItem
})
@Component({
  selector: "app-authentication-register",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [size]="'small'"
        [title]="'Register'"
        [submitLabel]="'Register'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class RegisterComponent extends PageComponent implements OnInit {
  public schema = { model: {}, fields };
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
