import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  accountResolvers,
  AccountsService,
} from "@baw-api/account/accounts.service";
import {
  theirEditMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@components/profile/profile.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../profile.schema.json";
import { theirProfileActions } from "../profile/their-profile.component";

const accountKey = "account";

@Component({
  selector: "baw-their-edit",
  template: `
    <baw-wip *ngIf="!failure">
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

      <baw-detail-view [model]="model" [fields]="fields"></baw-detail-view>
    </baw-wip>
  `,
})
class TheirEditComponent extends FormTemplate<User> implements OnInit {
  public fields = fields;
  public title: string;

  public constructor(
    private api: AccountsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, accountKey, (model) =>
      defaultSuccessMsg("updated", model.userName)
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Editing profile for ${this.model.userName}`;
    }
  }

  protected apiAction(model: Partial<User>) {
    return this.api.update(new User(model));
  }
}

TheirEditComponent.linkComponentToPageInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
}).andMenuRoute(theirEditMenuItem);

export { TheirEditComponent };
