import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
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
  resolvers: {
    account: "AccountShowResolver"
  },
  self: theirEditProfileMenuItem
})
@Component({
  selector: "app-their-profile-edit",
  template: `
    <app-wip>
      <ng-container *ngIf="user">
        <app-form
          [schema]="schema"
          [title]="'Editing profile for ' + user.userName"
          [submitLabel]="'Update User'"
          [submitLoading]="loading"
          [btnColor]="'btn-warning'"
          (onSubmit)="submit($event)"
        ></app-form>
      </ng-container>
    </app-wip>
  `
})
export class TheirEditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public schema = { model: { name: "" }, fields };
  public user: User;

  constructor(private api: AccountService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    const userModel: ResolvedModel<User> = this.route.snapshot.data.account;

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.schema.model.name = this.user.userName;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    console.log($event);
  }
}
