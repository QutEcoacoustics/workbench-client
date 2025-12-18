import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  scriptResolvers,
  ScriptsService,
} from "@baw-api/script/scripts.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Script } from "@models/Script";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { adminScriptActions } from "../details/details.component";
import schema from "../script.base.schema.json";
import {
  adminEditScriptMenuItem,
  adminScriptsCategory,
} from "../scripts.menus";

const scriptKey = "script";

@Component({
  selector: "baw-admin-scripts-edit",
  template: `
    @if (!failure) {
      <baw-form
        [title]="title"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
  imports: [FormComponent],
})
class AdminScriptsEditComponent extends FormTemplate<Script> implements OnInit {
  private readonly api = inject(ScriptsService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      getModel: (models) => models[scriptKey] as Script,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  public fields = schema.fields;
  public title: string;

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `New version of ${this.model.name} - v${this.model.version}`;
    }
  }

  protected apiAction(model: Partial<Script>) {
    return this.api.update(new Script(model));
  }
}

AdminScriptsEditComponent.linkToRoute({
  category: adminScriptsCategory,
  pageRoute: adminEditScriptMenuItem,
  menus: { actions: List(adminScriptActions) },
  resolvers: { [scriptKey]: scriptResolvers.show },
});

export { AdminScriptsEditComponent };
