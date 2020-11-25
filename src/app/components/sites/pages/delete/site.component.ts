import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "@components/sites/sites.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { siteMenuItemActions } from "../details/site.component";

const projectKey = "project";
const siteKey = "site";

@Component({
  selector: "baw-sites-delete",
  templateUrl: "./delete.component.html",
})
class SiteDeleteComponent extends FormTemplate<Site> implements OnInit {
  public title: string;

  public constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, siteKey, (model) =>
      defaultSuccessMsg("destroyed", model.name)
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected redirectionPath() {
    return this.project.viewUrl;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.destroy(new Site(model), this.project);
  }
}

SiteDeleteComponent.linkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(deleteSiteMenuItem);

export { SiteDeleteComponent };
