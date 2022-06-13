import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import {
  newPointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import pointSchema from "../../point.schema.json";
import siteSchema from "../../site.schema.json";

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
      redirectUser: (model) =>
        this.router.navigateByUrl(model.getViewUrl(this.project)),
      getModel: () => (this.region ? { regionId: this.region.id } : {}),
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    // Only sites with regions have their own page, normal sites are part of a
    // wizard
    this.title = this.region ? "New Point" : "";
    this.fields = this.region ? pointSchema.fields : siteSchema.fields;
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

// Only sites with regions have their own page, normal sites are part of a
// wizard
SiteNewComponent.linkToRoute({
  category: pointsCategory,
  pageRoute: newPointMenuItem,
  menus: { actions: List(regionMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { SiteNewComponent };
