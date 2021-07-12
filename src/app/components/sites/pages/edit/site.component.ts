import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
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
import schema from "../../site.base.json";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";
import { siteMenuItemActions } from "../details/site.component";
import { siteErrorMsg } from "../new/site.component";

const projectKey = "project";
const siteKey = "site";

@Component({
  selector: "baw-sites-edit",
  templateUrl: "./edit.component.html",
})
class SiteEditComponent extends FormTemplate<Site> implements OnInit {
  public fields = schema.fields;
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

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.name}`;
    }
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.update(new Site(model), this.project);
  }
}

SiteEditComponent.linkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(editSiteMenuItem);

export { SiteEditComponent };
