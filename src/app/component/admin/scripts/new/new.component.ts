import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptsService } from "@baw-api/scripts.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { Script } from "src/app/models/Script";
import { adminScriptsMenuItemActions } from "../list/list.component";
import { fields } from "../scripts.json";
import {
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
} from "../scripts.menus";

/**
 * New Scripts Component
 */
@Page({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminScriptsMenuItem,
      ...adminScriptsMenuItemActions,
    ]),
    links: List(),
  },
  self: adminNewScriptsMenuItem,
})
@Component({
  selector: "app-admin-scripts-new",
  template: `
    <app-form
      *ngIf="!failure"
      title="New Script"
      submitLabel="New Script"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    >
    </app-form>
  `,
})
export class AdminScriptsNewComponent extends FormTemplate<Script> {
  public fields = fields;

  constructor(
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
