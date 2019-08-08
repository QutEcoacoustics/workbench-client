import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "user-plus"],
  label: "Register",
  category: securityCategory,
  routeFragment: "register",
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
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class RegisterComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/register.json";

  constructor() {
    super();
  }

  ngOnInit() {}

  submit(model) {
    console.log(model);
  }
}
