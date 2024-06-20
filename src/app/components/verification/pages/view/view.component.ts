import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { verificationMenuItems } from "@components/verification/verification.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  IconName,
  IconPrefix,
  IconProp,
} from "@fortawesome/fontawesome-svg-core";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute } from "@angular/router";
import { VerificationParameters } from "../verificationParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-verification",
  templateUrl: "view.component.html",
  styleUrl: "view.component.scss",
})
class ViewVerificationComponent extends PageComponent implements OnInit {
  public constructor(private route: ActivatedRoute) {
    super();
  }

  protected searchParameters: VerificationParameters;
  protected areParametersCollapsed = true;
  protected project: Project;
  protected region?: Region;
  protected site?: Site;

  protected get chevronIcon(): IconProp {
    const prefix: IconPrefix = "fas" as const;
    const name: IconName = this.areParametersCollapsed
      ? "chevron-down"
      : "chevron-up";
    return [prefix, name];
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = [this.region];
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = [this.site];
    }
  }

  protected toggleParameters(): void {
    this.areParametersCollapsed = !this.areParametersCollapsed;
  }
}

function getPageInfo(
  subRoute: keyof typeof verificationMenuItems.view
): IPageInfo {
  return {
    pageRoute: verificationMenuItems.view[subRoute],
    category: verificationMenuItems.view[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

ViewVerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewVerificationComponent };
