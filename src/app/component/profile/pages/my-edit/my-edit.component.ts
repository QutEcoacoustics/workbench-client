import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModel } from "@baw-api/resolver-common";
import { userResolvers, UserService } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myEditMenuItem,
} from "@component/profile/profile.menus";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";
import { fields } from "./my-edit.schema.json";

const userKey = "user";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
    links: List(),
  },
  resolvers: {
    [userKey]: userResolvers.show,
  },
  self: myEditMenuItem,
})
@Component({
  selector: "app-my-account-edit",
  template: `
    <app-wip>
      <ng-container *ngIf="model">
        <app-form
          title="Profile Settings"
          [model]="model"
          [fields]="fields"
          btnColor="btn-warning"
          submitLabel="Update"
          [submitLoading]="loading"
          (onSubmit)="submitEdit($event)"
        ></app-form>

        <app-form
          title="Cancel my account"
          subTitle="Unhappy? You can permanently cancel your account."
          [model]="model"
          [fields]="[]"
          btnColor="btn-danger"
          submitLabel="Cancel my account"
          [submitLoading]="loading"
          (onSubmit)="submitDelete($event)"
        >
        </app-form>
      </ng-container>
    </app-wip>
  `,
})
export class MyEditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public model: User;
  public fields = fields;

  constructor(private route: ActivatedRoute, private api: UserService) {
    super();
  }

  ngOnInit() {
    this.loading = false;
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.model = userModel.model;
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
