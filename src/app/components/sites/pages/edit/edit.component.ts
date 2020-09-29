import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  editPointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
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
import { fields } from "../../site.base.json";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";
import {
  pointMenuItemActions,
  siteMenuItemActions,
} from "../details/details.component";
import { siteErrorMsg } from "../new/new.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "app-sites-edit",
  templateUrl: "./edit.component.html",
})
class SiteEditComponent extends FormTemplate<Site> implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      siteKey,
      (model) => defaultSuccessMsg("updated", model.name),
      siteErrorMsg
    );
  }

  public ngOnInit() {
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

@Component({
  selector: "app-points-edit",
  templateUrl: "./edit.component.html",
})
class PointEditComponent extends SiteEditComponent {}

SiteEditComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(editSiteMenuItem);

PointEditComponent.LinkComponentToPageInfo({
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
}).AndMenuRoute(editPointMenuItem);

export { SiteEditComponent, PointEditComponent };
