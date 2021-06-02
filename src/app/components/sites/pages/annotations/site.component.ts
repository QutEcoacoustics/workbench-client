import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  siteAnnotationsMenuItem,
  siteMenuItem,
  sitesCategory,
} from "@components/sites/sites.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { List } from "immutable";
import { siteMenuItemActions } from "../details/site.component";
import { fields } from "./annotations.schema.json";

interface TimezoneModel {
  timezone?: string;
}

const projectKey = "project";
const siteKey = "site";

@Component({
  selector: "baw-site-annotations",
  templateUrl: "annotations.component.html",
})
class SiteAnnotationsComponent extends PageComponent implements OnInit {
  public failure: boolean;
  public fields: FormlyFieldConfig[] = fields;
  public form = new FormGroup({});
  public model: TimezoneModel = { timezone: "UTC" };
  public region: Region;
  protected models: ResolvedModelList;
  protected project: Project;
  protected site: Site;

  public constructor(
    protected siteApi: SitesService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data as PageInfo;
    const models = retrieveResolvers(data);

    if (!models) {
      this.failure = true;
      return;
    }
    this.models = models;
    this.project = models[projectKey] as Project;
    this.site = models[siteKey] as Site;
    this.model.timezone = this.site.tzinfoTz ?? this.model.timezone;
  }

  public getAnnotationsPath(): string {
    return this.siteApi.downloadAnnotations(
      this.site,
      this.project,
      this.model.timezone
    );
  }
}

SiteAnnotationsComponent.linkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent, {})],
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(siteAnnotationsMenuItem);

export { SiteAnnotationsComponent };
