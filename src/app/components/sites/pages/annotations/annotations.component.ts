import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
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
  template: `
    <baw-form
      title="Annotations Download"
      [submitLabel]="null"
      [model]="model"
      [fields]="fields"
    >
      <span id="subTitle">
        <p>
          The annotations in the CSV will have all their dates and times set to
          a time zone of your choice. The default time zone is the local time
          for the site where the audio was recorded.
        </p>
        <p>
          For example, annotations created for audio from Brisbane will have
          dates and times set to AEST (+10).
        </p>
        <p>
          However, if you have recordings from Brisbane and Perth, which time
          zone do we choose for all downloaded events?
        </p>
        <p>AEST (+10) or AWST (+8) or UTC (+0)?</p>
        <p>
          It depends on how you want to work with your data, so the choice is
          yours. Please select the time zone you wish to use:
        </p>
      </span>
    </baw-form>

    <div class="clearfix">
      <a class="btn btn-primary float-right" [href]="getAnnotationsPath()">
        Download Annotations
      </a>
    </div>
  `,
})
class SiteAnnotationsComponent extends PageComponent implements OnInit {
  public model: TimezoneModel = { timezone: "UTC" };
  public fields: FormlyFieldConfig[] = fields;
  public form = new FormGroup({});
  public failure: boolean;
  public project: Project;
  public site: Site;

  public constructor(
    private siteApi: SitesService,
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
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(siteAnnotationsMenuItem);

export { SiteAnnotationsComponent };
