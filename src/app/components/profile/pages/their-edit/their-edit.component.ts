import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  accountResolvers,
  AccountsService,
} from "@baw-api/account/accounts.service";
import {
  theirEditMenuItem,
  theirProfileCategory,
} from "@components/profile/profile.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { User } from "@models/User";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { theirProfileActions } from "../profile/their-profile.component";
import schema from "../../profile.schema.json";

const accountKey = "account";

@Component({
  selector: "baw-their-edit",
  template: `
    <ng-container *ngIf="!failure">
      <baw-form
        [title]="title"
        btnColor="warning"
        [model]="model"
        [fields]="fields"
        submitLabel="Update User"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>

      <hr />

      <baw-detail-view
        [model]="originalModel"
        [fields]="fields"
      ></baw-detail-view>
    </ng-container>
  `,
  standalone: false
})
class TheirEditComponent extends FormTemplate<User> implements OnInit {
  public fields = schema.fields;
  public title: string;
  public originalModel: User;

  public constructor(
    private api: AccountsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[accountKey] as User,
      successMsg: (model) => defaultSuccessMsg("updated", model.userName),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Editing profile for ${this.model.userName}`;
      this.originalModel = Object.assign({}, this.model as User);
    }
  }

  protected apiAction(model: Partial<User>) {
    return this.api.update(new User(model));
  }
}

TheirEditComponent.linkToRoute({
  category: theirProfileCategory,
  pageRoute: theirEditMenuItem,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
});

export { TheirEditComponent };
