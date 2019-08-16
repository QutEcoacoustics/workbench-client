import { Component, OnDestroy, OnInit } from "@angular/core";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { securityCategory } from "../../authentication";
import data from "./register.json";

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
      [schema]="schema"
      [title]="'Register'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class RegisterComponent extends PageComponent
  implements OnInit, OnDestroy {
  private subs = new SubSink();
  schema = data;
  error: string;
  loading: boolean;

  constructor(private api: SecurityService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.subs.sink = this.api.getLoggedInTrigger().subscribe(loggedIn => {
      if (loggedIn) {
        this.loading = true;
        this.error = "You are already logged in";
      } else {
        this.loading = false;
        this.error = null;
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
