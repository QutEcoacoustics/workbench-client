import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Script } from "src/app/models/Script";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
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
      title="New Script"
      submitLabel="New Script"
      [schema]="schema"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    >
    </app-form>
  `
})
export class AdminScriptsNewComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public schema = { model: {}, fields };
  public loading: boolean;

  constructor(
    private api: ScriptsService,
    private router: Router,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.schema.model["executableSettingsMediaType"] = "text/plain";
  }

  public submit($event) {
    this.loading = true;

    this.api
      .create(new Script($event))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        script => {
          this.resetForms();
          this.notification.success("Script was successfully created.");
          this.router.navigateByUrl(script.redirectPath());
        },
        (err: ApiErrorDetails) => {
          this.notification.error(err.message);
          this.loading = false;
        }
      );
  }
}
