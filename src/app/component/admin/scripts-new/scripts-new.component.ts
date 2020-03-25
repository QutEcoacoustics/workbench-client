import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  defaultSuccessMsg,
  FormTemplate
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Script } from "src/app/models/Script";
import { ScriptsService } from "src/app/services/baw-api/scripts.service";
import {
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem
} from "../admin.menus";
import { adminScriptsMenuItemActions } from "../scripts/scripts.component";
import { fields } from "./new.json";

@Page({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminScriptsMenuItem,
      ...adminScriptsMenuItemActions
    ]),
    links: List()
  },
  self: adminNewScriptsMenuItem
})
@Component({
  selector: "app-scripts-new",
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
  `
})
export class AdminScriptsNewComponent extends FormTemplate<Script>
  implements OnInit {
  public fields = fields;

  constructor(
    private api: ScriptsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, model =>
      defaultSuccessMsg("created", model.name)
    );
  }

  protected apiAction(model: Partial<Script>) {
    return this.api.create(new Script(model));
  }
}
