import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myDeleteMenuItem,
} from "@components/profile/profile.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
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
    super(notifications, route, router, {
      getModel: (models) => models[userKey] as User,
      successMsg: (model) => defaultSuccessMsg("destroyed", model.userName),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<User>) {
    return this.api.destroy(new User(model));
  }
}

MyDeleteComponent.linkToRouterWith(
  {
    category: myAccountCategory,
    menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
    resolvers: { [userKey]: userResolvers.show },
  },
  myDeleteMenuItem
);

export { MyDeleteComponent };
