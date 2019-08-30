import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { registerMenuItem, securityCategory } from "../../security.menus";
import data from "./register.json";

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
        [title]="'Register'"
        [submitLoading]="loading"
        [error]="error"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
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
