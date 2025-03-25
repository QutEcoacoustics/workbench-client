import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptsService } from "@baw-api/script/scripts.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Script } from "@models/Script";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { adminScriptsMenuItemActions } from "../list/list.component";
import schema from "../script.base.schema.json";
import {
  newScriptMenuItem,
  adminScriptsCategory,
} from "../scripts.menus";

/**
 * New Scripts Component
 */
@Component({
  selector: "baw-admin-scripts-new",
  template: `
    <baw-form
      *ngIf="!failure"
      title="New Script"
      submitLabel="New Script"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminScriptsNewComponent extends FormTemplate<Script> {
  public constructor(
    private api: ScriptsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public fields = schema.fields;

  protected apiAction(model: Partial<Script>) {
    return this.api.create(new Script(model));
  }
}

AdminScriptsNewComponent.linkToRoute({
  category: adminScriptsCategory,
  pageRoute: newScriptMenuItem,
  menus: { actions: List(adminScriptsMenuItemActions) },
});

export { AdminScriptsNewComponent };
