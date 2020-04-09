import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import {
  accountResolvers,
  AccountService,
} from "src/app/services/baw-api/account.service";
import { fields } from "../../profile.json";
import {
  theirEditProfileMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "../../profile.menus";
import { theirProfileMenuItemActions } from "../profile/their-profile.component";

const accountKey = "account";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      theirProfileMenuItem,
      ...theirProfileMenuItemActions,
    ]),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirEditProfileMenuItem,
})
@Component({
  selector: "app-their-profile-edit",
  template: `
    <app-wip *ngIf="!failure">
      <app-form
        [title]="title"
        btnColor="btn-warning"
        [model]="model"
        [fields]="fields"
        submitLabel="Update User"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>

      <hr />

      <app-detail-view [model]="model" [fields]="fields"></app-detail-view>
    </app-wip>
  `,
})
export class TheirEditComponent extends FormTemplate<User> implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: AccountService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, accountKey, (model) =>
      defaultSuccessMsg("updated", model.userName)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Editing profile for ${this.model.userName}`;
    }
  }

  protected apiAction(model: Partial<User>) {
    return this.api.update(new User(model));
  }
}
