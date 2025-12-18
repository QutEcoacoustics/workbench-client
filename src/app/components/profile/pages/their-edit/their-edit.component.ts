import { Component, OnInit, inject } from "@angular/core";
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
import { FormComponent } from "@shared/form/form.component";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import { theirProfileActions } from "../profile/their-profile.component";
import schema from "../../profile.schema.json";

const accountKey = "account";

@Component({
  selector: "baw-their-edit",
  template: `
    @if (!failure) {
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
    }
  `,
  imports: [FormComponent, DetailViewComponent]
})
class TheirEditComponent extends FormTemplate<User> implements OnInit {
  private readonly api = inject(AccountsService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;
  public title: string;
  public originalModel: User;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      getModel: (models) => models[accountKey] as User,
      successMsg: (model) => defaultSuccessMsg("updated", model.userName),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
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
