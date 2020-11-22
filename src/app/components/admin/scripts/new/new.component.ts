import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptsService } from "@baw-api/script/scripts.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Script } from "@models/Script";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminScriptsMenuItemActions } from "../list/list.component";
import { fields } from "../script.base.schema.json";
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
  public fields = fields;

  public constructor(
    private api: ScriptsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, (model) =>
      defaultSuccessMsg("created", model.name)
    );
  }

  protected apiAction(model: Partial<Script>) {
    return this.api.create(new Script(model));
  }
}

AdminScriptsNewComponent.LinkComponentToPageInfo({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminScriptsMenuItem,
      ...adminScriptsMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminNewScriptsMenuItem);

export { AdminScriptsNewComponent };
