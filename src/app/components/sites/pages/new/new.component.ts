import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import { regionMenuItem } from "@components/regions/regions.menus";
import {
  newPointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import {
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../site.base.json";
import { newSiteMenuItem } from "../../sites.menus";

const projectKey = "project";
const regionKey = "region";

@Component({
  selector: "app-sites-new",
  templateUrl: "./new.component.html",
})
class SiteNewComponent extends FormTemplate<Site> {
  public fields = fields;

  constructor(
    protected api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      (model) => defaultSuccessMsg("created", model.name),
      siteErrorMsg
    );
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected redirectionPath(model: Site) {
    return model.getViewUrl(this.project);
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(new Site(model), this.project);
  }
}

@Component({
  selector: "app-points-new",
  templateUrl: "./new.component.html",
})
class PointNewComponent extends SiteNewComponent {
  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(
      new Site({ ...model, regionId: this.region.id }),
      this.project
    );
  }
}

SiteNewComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: { actions: List([projectMenuItem, ...projectMenuItemActions]) },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(newSiteMenuItem);

PointNewComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: { actions: List([regionMenuItem, ...regionMenuItemActions]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(newPointMenuItem);

export { SiteNewComponent, PointNewComponent };

export function siteErrorMsg(err: ApiErrorDetails) {
  return extendedErrorMsg(err, {
    tzinfoTz: (value) => `timezone identifier ${value[0]}`,
  });
}
