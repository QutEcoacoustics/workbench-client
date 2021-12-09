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
import { Option } from "@helpers/advancedTypes";
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
import pointSchema from "../../point.base.json";
import siteSchema from "../../site.base.json";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";
import {
  pointMenuItemActions,
  siteMenuItemActions,
} from "../details/site.component";
import { siteErrorMsg } from "../new/site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-sites-edit",
  templateUrl: "./edit.component.html",
})
class SiteEditComponent extends FormTemplate<Site> implements OnInit {
  public title: string;

  public constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[siteKey] as Site,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      failureMsg: (error) => siteErrorMsg(error),
      redirectUser: (model) =>
        this.router.navigateByUrl(model.getViewUrl(this.project)),
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.name}`;
      this.fields = this.region ? pointSchema.fields : siteSchema.fields;
    }
  }

  public get region(): Option<Region> {
    return this.models[regionKey] as Region;
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.update(new Site(model), this.project);
  }
}

SiteEditComponent.linkToRouterWith(
  {
    category: sitesCategory,
    menus: {
      actions: List([siteMenuItem, ...siteMenuItemActions]),
      actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
    },
    resolvers: {
      [projectKey]: projectResolvers.show,
      [siteKey]: siteResolvers.show,
    },
  },
  editSiteMenuItem
).linkToRouterWith(
  {
    category: pointsCategory,
    menus: {
      actions: List([pointMenuItem, ...pointMenuItemActions]),
      actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
    },
    resolvers: {
      [projectKey]: projectResolvers.show,
      [regionKey]: regionResolvers.show,
      [siteKey]: siteResolvers.show,
    },
  },
  editPointMenuItem
);

export { SiteEditComponent };
