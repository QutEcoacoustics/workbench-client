import { Component, OnInit } from "@angular/core";

import { MenuRoute } from "src/app/interfaces/menus.interfaces";
import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { registerMenuItem, securityCategory, securityRoute } from "../../authentication.menus";

@Page({
  category: securityCategory,
  menus: null,
  self: registerMenuItem
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
