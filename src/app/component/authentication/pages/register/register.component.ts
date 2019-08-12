import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import { securityCategory, securityRoute } from "../../authentication";

@Page({
  icon: ["fas", "user-plus"],
  label: "Register",
  category: securityCategory,
  route: securityRoute.add("register"),
  tooltip: () => "Create an account",
  predicate: user => !user,
  menus: null,
  order: { priority: 3, indentation: 0 }
})
@Component({
  selector: "app-authentication-register",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Register'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class RegisterComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/register.json";
  error: string;
  loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
