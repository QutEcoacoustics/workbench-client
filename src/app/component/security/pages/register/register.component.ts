import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
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
        [submitLabel]="'Register'"
        [submitLoading]="loading"
        [error]="error"
        (onSubmit)="submit($event)"
      ></app-form>
      <app-error-handler [error]="errorDetails"></app-error-handler>
    </app-wip>
  `
})
export class RegisterComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  schema = data;
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;

  constructor(private api: BawApiService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    if (this.api.isLoggedIn()) {
      this.loading = true;
      this.error = "You are already logged in";
    } else {
      this.loading = false;
      this.error = null;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
