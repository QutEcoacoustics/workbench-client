import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap, takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  theirEditProfileMenuItem,
  theirProfileCategory,
  theirProfileMenuItem
} from "../../profile.menus";
import { theirProfileMenuItemActions } from "../profile/their-profile.component";
import { fields } from "./their-edit.json";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      theirProfileMenuItem,
      ...theirProfileMenuItemActions
    ]),
    links: List()
  },
  self: theirEditProfileMenuItem
})
@Component({
  selector: "app-their-profile-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Editing profile for ' + user.userName"
        [error]="error"
        [success]="success"
        [submitLabel]="'Update User'"
        [submitLoading]="loading"
        [btnColor]="'btn-warning'"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class TheirEditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = { model: {}, fields };
  success: string;

  user: User;

  constructor(private api: AccountService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.show(params.userId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (user: User) => {
          this.user = user;
          this.ready = true;

          this.schema.model["name"] = this.user.userName;
        },
        (err: ApiErrorDetails) => {
          this.errorDetails = err;
        }
      );
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    console.log($event);
  }
}
