import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "src/app/component/sites/sites.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import {
  siteResolvers,
  SitesService,
} from "src/app/services/baw-api/sites.service";
import { siteMenuItemActions } from "../details/details.component";

const projectKey = "project";
const siteKey = "site";

/**
 * Delete Site Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
  self: deleteSiteMenuItem,
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `,
})
export class DeleteComponent extends FormTemplate<Site> implements OnInit {
  public title: string;

  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, siteKey, (model) =>
      defaultSuccessMsg("destroyed", model.name)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected redirectionPath() {
    return this.project.navigationPath();
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.destroy(new Site(model), this.project);
  }
}
