import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editMyAccountMenuItem,
  myAccountCategory,
  myAccountMenuItem
} from "../../profile.menus";
import { myProfileMenuItemActions } from "../profile/my-profile.component copy";
import { fields } from "./my-edit.json";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      myAccountMenuItem,
      ...myProfileMenuItemActions
    ]),
    links: List()
  },
  self: editMyAccountMenuItem
})
@Component({
  selector: "app-my-account-edit",
  template: `
    <app-wip>
      <ng-container *ngIf="user">
        <app-form
          [schema]="schema"
          [title]="'Profile Settings'"
          [submitLabel]="'Update'"
          [submitLoading]="loading"
          [btnColor]="'btn-warning'"
          (onSubmit)="submitEdit($event)"
        ></app-form>

        <app-form
          [schema]="{ model: {}, fields: [] }"
          [title]="'Cancel my account'"
          [subTitle]="'Unhappy? You can permanently cancel your account.'"
          [submitLabel]="'Cancel my account'"
          [submitLoading]="loading"
          [btnColor]="'btn-danger'"
          (onSubmit)="submitDelete($event)"
        >
        </app-form>
      </ng-container>
    </app-wip>
  `
})
export class MyEditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public schema = { model: { edit: { name: "" } }, fields };
  public user: User;

  constructor(private route: ActivatedRoute, private api: UserService) {
    super();
  }

  ngOnInit() {
    this.loading = false;
    const userModel: ResolvedModel<User> = this.route.snapshot.data.user;

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.schema.model.edit.name = this.user.userName;
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
