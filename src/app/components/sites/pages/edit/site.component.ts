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
import { fields } from "../../site.base.json";
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

export { SiteEditComponent };
