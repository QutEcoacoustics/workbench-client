import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ToastrService } from "ngx-toastr";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import { regionMenuItem } from "@components/regions/regions.menus";
import {
  pointsCategory,
  newPointMenuItem,
} from "@components/sites/points.menus";
import { List } from "immutable";
import pointSchema from "../../point.base.json";
import siteSchema from "../../site.base.json";

const projectKey = "project";
const regionKey = "region";

@Component({
  selector: "baw-sites-new",
  templateUrl: "./new.component.html",
})
class SiteNewComponent extends FormTemplate<Site> implements OnInit {
  public title = "";

  public constructor(
    protected api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      failureMsg: (error) => siteErrorMsg(error),
      redirectUser: (model) =>
        this.router.navigateByUrl(model.getViewUrl(this.project)),
      getModel: () => (this.region ? { regionId: this.region.id } : {}),
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      // Only sites with regions have their own page, normal sites are part of
      // a wizard
      this.title = this.region ? "New Point" : "";
      this.fields = this.region ? pointSchema.fields : siteSchema.fields;
    }
  }

  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(new Site(model), this.project);
  }
}

export function siteErrorMsg(err: ApiErrorDetails) {
  return extendedErrorMsg(err, {
    tzinfoTz: (value) => `timezone identifier ${value[0]}`,
  });
}

// Only sites with regions have their own page, normal sites are part of a
// wizard
SiteNewComponent.linkToRoute({
  category: pointsCategory,
  menuRoute: newPointMenuItem,
  menus: { actions: List([regionMenuItem, ...regionMenuItemActions]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { SiteNewComponent };
