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
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { pointMenuItemActions } from "../details/point.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

// Unfortunately we cannot extends the SiteDeleteComponent because the redirectUser
// value is different
@Component({
  selector: "baw-points-delete",
  templateUrl: "./delete.component.html",
})
class PointDeleteComponent extends FormTemplate<Site> implements OnInit {
  public title: string;

  public constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[siteKey] as Site,
      successMsg: (model) => defaultSuccessMsg("destroyed", model.name),
      redirectUser: () => this.router.navigateByUrl(this.region.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  public get region(): Region {
    return this.models.region as Region;
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.destroy(new Site(model), this.project);
  }
}
PointDeleteComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent)],
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(deletePointMenuItem);
export { PointDeleteComponent };
