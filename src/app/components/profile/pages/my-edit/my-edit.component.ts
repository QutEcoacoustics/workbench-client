import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModel } from "@baw-api/resolver-common";
import { userResolvers, UserService } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myEditMenuItem,
} from "@components/profile/profile.menus";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";
import { fields } from "./my-edit.schema.json";

const userKey = "user";

@Component({
  selector: "baw-my-edit",
  template: `
    <baw-wip>
      <ng-container *ngIf="model">
        <baw-form
          title="Profile Settings"
          [model]="model"
          [fields]="fields"
          btnColor="warning"
          submitLabel="Update"
          [submitLoading]="loading"
          (onSubmit)="submitEdit($event)"
        ></baw-form>

        <baw-form
          title="Cancel my account"
          subTitle="Unhappy? You can permanently cancel your account."
          [model]="model"
          [fields]="[]"
          btnColor="danger"
          submitLabel="Cancel my account"
          [submitLoading]="loading"
          (onSubmit)="submitDelete($event)"
        >
        </baw-form>
      </ng-container>
    </baw-wip>
  `,
})
class MyEditComponent extends withFormCheck(PageComponent) implements OnInit {
  public loading: boolean;
  public model: User;
  public fields = fields;

  public constructor(private route: ActivatedRoute, private api: UserService) {
    super();
  }

  public ngOnInit() {
    this.loading = false;
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.model = userModel.model;
  }

  /**
   * Edit form submission
   *
   * @param $event Form response
   */
  public submitEdit($event: any) {
    console.log("Edit Submission: ", $event);
  }

  /**
   * Delete form submission
   *
   * @param $event Form response
   */
  public submitDelete($event: any) {
    console.log("Delete Submission", $event);
  }
}

MyEditComponent.linkComponentToPageInfo({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
  },
  resolvers: { [userKey]: userResolvers.show },
}).andMenuRoute(myEditMenuItem);

export { MyEditComponent };
