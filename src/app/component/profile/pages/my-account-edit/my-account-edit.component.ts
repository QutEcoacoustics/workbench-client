import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editMyAccountMenuItem,
  myAccountCategory,
  myAccountMenuItem
} from "../../profile.menus";
import data from "./my-account-edit.json";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, editMyAccountMenuItem]),
    links: List()
  },
  self: editMyAccountMenuItem
})
@Component({
  selector: "app-my-account-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Profile Settings'"
        [error]="error"
        [success]="success"
        [submitLabel]="'Update'"
        [submitLoading]="loading"
        [btnColor]="'btn-warning'"
        (onSubmit)="submitEdit($event)"
      ></app-form>

      <app-form
        *ngIf="ready"
        [schema]="{ model: {}, fields: [] }"
        [title]="'Cancel my account'"
        [subTitle]="'Unhappy? You can permanently cancel your account.'"
        [submitLabel]="'Cancel my account'"
        [submitLoading]="loading"
        [btnColor]="'btn-danger'"
        (onSubmit)="submitDelete($event)"
      >
      </app-form>
    </app-wip>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class MyAccountEditComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: string;
  errorDetails: APIErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  success: string;

  user: User;

  constructor(private api: UserService) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

    this.api
      .getMyAccount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.ready = true;

          this.schema.model.edit["name"] = this.user.userName;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Edit form submission
   * @param $event Form response
   */
  submitEdit($event: any) {
    console.log("Edit Submission: ", $event);
  }

  /**
   * Delete form submission
   * @param $event Form response
   */
  submitDelete($event: any) {
    console.log("Delete Submission", $event);
  }
}
