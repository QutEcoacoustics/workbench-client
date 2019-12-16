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
  editProfileMenuItem,
  myAccountCategory,
  profileMenuItem
} from "../../my-account.menus";
import data from "./edit.json";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([profileMenuItem, editProfileMenuItem]),
    links: List()
  },
  self: editProfileMenuItem
})
@Component({
  selector: "app-my-account-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Profile Settings'"
        [error]="errorEdit"
        [success]="successEdit"
        [submitLabel]="'Update'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>

      <app-form
        *ngIf="ready"
        [schema]="{ model: {}, fields: [] }"
        [title]="'Cancel my account'"
        [subTitle]="'Unhappy? You can permanently cancel your account.'"
        [error]="errorDelete"
        [success]="successDelete"
        [submitLabel]="'Cancel my account'"
        [submitLoading]="loading"
        [btnColor]="'btn-danger'"
        (onSubmit)="submit($event)"
      >
      </app-form>
    </app-wip>
    <app-error-handler [errorCode]="errorCode"></app-error-handler>
  `
})
export class EditComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  errorEdit: string;
  errorDelete: string;
  errorCode: number;
  loading: boolean;
  ready: boolean;
  schema = data;
  successEdit: string;
  successDelete: string;

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
          this.errorCode = err.status;
          this.loading = false;
        }
      );
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
    console.log($event);
  }
}
