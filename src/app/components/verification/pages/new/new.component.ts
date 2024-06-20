import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
} from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import {
  siteResolvers,
} from "@baw-api/site/sites.service";
import { siteAnnotationsModal } from "@components/sites/sites.modals";
import { VerificationSearch } from "@components/verification/components/annotation-search-form/annotation-search-form.component";
import { verificationMenuItems } from "@components/verification/verification.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-new-verification",
  templateUrl: "new.component.html",
  styleUrl: "new.component.scss",
})
class NewVerificationComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute
  ) {
    super();
  }

  protected project: Project;
  protected region?: Region;
  protected site?: Site;
  public model: VerificationSearch = {
    regions: [],
    sites: [],
    tags: [],
    dateFilters: {},
    onlyUnverified: false,
  };

  protected get pageTitle(): string {
    if (this.site) {
      return this.site.isPoint
        ? `Point: ${this.site.name}`
        : `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    return `Project: ${this.project.name}`;
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = [this.region];
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = [this.site];
    }
  }
}

function getPageInfo(
  subRoute: keyof typeof verificationMenuItems.new
): IPageInfo {
  return {
    pageRoute: verificationMenuItems.new[subRoute],
    category: verificationMenuItems.new[subRoute],
    menus: {
      actions: List([verificationMenuItems.view[subRoute], siteAnnotationsModal]),
    },
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

NewVerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { NewVerificationComponent };
