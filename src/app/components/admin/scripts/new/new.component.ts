import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptsService } from "@baw-api/script/scripts.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Script } from "@models/Script";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminScriptsMenuItemActions } from "../list/list.component";
import schema from "../script.base.schema.json";
import {
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
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
    >
    </baw-form>
  `,
})
class AdminScriptsNewComponent extends FormTemplate<Script> {
  public fields = schema.fields;

  public constructor(
    private api: ScriptsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<Script>) {
    return this.api.create(new Script(model));
  }
}

AdminScriptsNewComponent.linkComponentToPageInfo({
  category: adminScriptsCategory,
  menus: {
    actions: List([adminScriptsMenuItem, ...adminScriptsMenuItemActions]),
  },
}).andMenuRoute(adminNewScriptsMenuItem);

export { AdminScriptsNewComponent };
