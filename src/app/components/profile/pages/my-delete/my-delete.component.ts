import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myDeleteMenuItem,
} from "@components/profile/profile.menus";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { defaultSuccessMsg } from "@helpers/formTemplate/simpleFormTemplate";
import { User } from "@models/User";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      title="Cancel my account"
      subTitle="Unhappy? You can permanently cancel your account."
      [model]="model"
      [fields]="[]"
      btnColor="danger"
      submitLabel="Cancel my account"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class MyDeleteComponent extends FormTemplate<User> {
  public title: string;

  public constructor(
    private api: AccountsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, userKey, (model) =>
      defaultSuccessMsg("destroyed", model.userName)
    );
  }

  protected apiAction(model: Partial<User>) {
    return this.api.destroy(new User(model));
  }
}

MyDeleteComponent.linkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).andMenuRoute(myDeleteMenuItem);

export { MyDeleteComponent };
