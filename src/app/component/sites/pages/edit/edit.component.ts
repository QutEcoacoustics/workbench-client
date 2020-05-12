import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { fields } from "../../site.base.json";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";

const projectKey = "project";
const siteKey = "site";

/**
 * Edit Site Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
  self: editSiteMenuItem,
})
@Component({
  selector: "app-sites-edit",
  template: `
    <!-- Move ngIf to app-form when app-wip removed -->
    <app-wip *ngIf="!failure">
      <app-form
        [title]="title"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `,
})
export class EditComponent extends FormTemplate<Site> implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, siteKey, (model) =>
      defaultSuccessMsg("updated", model.name)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.name}`;
    }
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  protected redirectionPath(model: Site) {
    return model.getViewUrl(this.project);
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.update(new Site(model), this.project);
  }
}
