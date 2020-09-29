import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  deletePointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "@components/sites/sites.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  pointMenuItemActions,
  siteMenuItemActions,
} from "../details/details.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "app-sites-delete",
  templateUrl: "./delete.component.html",
})
class SiteDeleteComponent extends FormTemplate<Site> implements OnInit {
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

@Component({
  selector: "app-points-delete",
  templateUrl: "./delete.component.html",
})
class PointDeleteComponent extends SiteDeleteComponent {
  public get region(): Region {
    return this.models.region as Region;
  }

  protected redirectionPath() {
    return this.region.viewUrl;
  }
}

SiteDeleteComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(deleteSiteMenuItem);

PointDeleteComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(deletePointMenuItem);

export { SiteDeleteComponent, PointDeleteComponent };
