import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "src/app/component/sites/sites.menus";
import { DeleteFormTemplate } from "src/app/helpers/formTemplate/deleteTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { siteMenuItemActions } from "../details/details.component";
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: deleteSiteMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="models"
      [schema]="schema"
      [title]="'Are you certain you wish to delete ' + getSite().name + '?'"
      [btnColor]="'btn-danger'"
      [submitLabel]="'Delete'"
      [submitLoading]="loading"
      (onSubmit)="submit()"
    ></app-form>
  `
})
export class DeleteComponent extends DeleteFormTemplate<Site> {
  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(["site", "project"], [], notifications, route, router);
  }

  public getSite(): Site {
    return this.models.site as Site;
  }

  public getProject(): Project {
    return this.models.project as Project;
  }

  apiDestroy() {
    const site = this.getSite();
    const project = this.getProject();
    return this.api.destroy(site, project);
  }

  successMessage() {
    return "Successfully deleted " + this.getSite().name;
  }

  redirectPath() {
    const project = this.getProject();
    return project.redirectPath();
  }
}
