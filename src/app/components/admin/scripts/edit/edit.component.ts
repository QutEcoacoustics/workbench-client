import { Component, OnInit } from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { adminScriptActions } from "../details/details.component";
import { fields } from "../script.base.schema.json";
import {
  adminEditScriptMenuItem,
  adminScriptMenuItem,
  adminScriptsCategory,
} from "../scripts.menus";

const scriptKey = "script";

@Component({
  selector: "baw-admin-scripts-edit",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminScriptsEditComponent extends FormTemplate<Script> implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: ScriptsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, scriptKey, (model) =>
      defaultSuccessMsg("updated", model.name)
    );
  }

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

AdminScriptsEditComponent.LinkComponentToPageInfo({
  category: adminScriptsCategory,
  menus: { actions: List([adminScriptMenuItem, ...adminScriptActions]) },
  resolvers: { [scriptKey]: scriptResolvers.show },
}).AndMenuRoute(adminEditScriptMenuItem);

export { AdminScriptsEditComponent };
