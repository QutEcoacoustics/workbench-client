import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myEditMenuItem,
} from "@components/profile/profile.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { User } from "@models/User";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { myAccountActions } from "../profile/my-profile.component";
import schema from "./my-edit.schema.json";
import { FormComponent } from "../../../shared/form/form.component";

const userKey = "user";

@Component({
    selector: "baw-my-edit",
    template: `
    @if (!failure) {
      <baw-form
        title="Profile Settings"
        [model]="model"
        [fields]="fields"
        btnColor="warning"
        submitLabel="Update"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
    imports: [FormComponent]
})
class MyEditComponent extends FormTemplate<User> {
  public fields = schema.fields;
  public title: string;

  public constructor(
    private api: AccountsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[userKey] as User,
      successMsg: (model) => defaultSuccessMsg("updated", model.userName),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<User>) {
    return this.api.update(new User(model));
  }
}

MyEditComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: myEditMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MyEditComponent };
