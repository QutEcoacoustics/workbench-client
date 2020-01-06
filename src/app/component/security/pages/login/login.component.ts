import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { SecurityService } from "src/app/services/baw-api/security.service";
import {
  confirmAccountMenuItem,
  loginMenuItem,
  resetPasswordMenuItem,
  securityCategory,
  unlockAccountMenuItem
} from "../../security.menus";
import data from "./login.json";

@Page({
  category: securityCategory,
  menus: {
    actions: List<AnyMenuItem>([
      confirmAccountMenuItem,
      resetPasswordMenuItem,
      unlockAccountMenuItem
    ]),
    links: List()
  },
  self: loginMenuItem
})
@Component({
  selector: "app-authentication-login",
  template: `
    <app-form
      [schema]="schema"
      [title]="'Log in'"
      [error]="error"
      [submitLabel]="'Log in'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class LoginComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  schema = data;
  error: string;
  errorDetails: APIErrorDetails;
  loading: boolean;

  constructor(
    private api: SecurityService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    const msg = "You are already logged in";

    if (this.api.isLoggedIn()) {
      this.loading = true;
      this.error = msg;
    } else {
      this.loading = false;

      if (this.error === msg) {
        this.error = null;
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    this.ref.detectChanges();

    this.api
      .signIn($event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.router.navigate([""]);
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
