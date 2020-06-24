import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { projectMenuItemActions } from "src/app/component/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem,
} from "src/app/component/projects/projects.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { fields } from "../../site.base.json";
import { newSiteMenuItem } from "../../sites.menus";

const projectKey = "project";

/**
 * New Site Component
 */
@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
  self: newSiteMenuItem,
})
@Component({
  selector: "app-sites-new",
  template: `
    <baw-form
      *ngIf="!failure"
      title="New Site"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
export class NewComponent extends FormTemplate<Site> {
  public fields = fields;

  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, (model) =>
      defaultSuccessMsg("created", model.name)
    );
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  protected redirectionPath(model: Site) {
    return model.getViewUrl(this.project);
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(new Site(model), this.project);
  }
}
