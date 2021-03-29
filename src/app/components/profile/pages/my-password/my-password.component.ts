import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myPasswordMenuItem,
} from "@components/profile/profile.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { defaultSuccessMsg } from "@helpers/formTemplate/simpleFormTemplate";
import { User } from "@models/User";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { myAccountActions } from "../profile/my-profile.component";
import { fields } from "./my-password.schema.json";

const userKey = "user";

@Component({
  selector: "baw-my-password",
  template: `
    <baw-form
      *ngIf="!failure"
      title="Update my password"
      [model]="model"
      [fields]="fields"
      btnColor="warning"
      submitLabel="Update"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class MyPasswordComponent extends FormTemplate<User> {
  public fields = fields;
  public title: string;

  public constructor(
    private api: AccountsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, userKey, (model) =>
      defaultSuccessMsg("updated", model.userName)
    );
  }

  protected apiAction(model: Partial<User>) {
    return this.api.update(new User(model));
  }
}

MyPasswordComponent.linkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).andMenuRoute(myPasswordMenuItem);

export { MyPasswordComponent };
