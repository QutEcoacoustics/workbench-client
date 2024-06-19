import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { verificationMenuItems } from "@components/verification/verification.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-verification",
  templateUrl: "view.component.html",
  styleUrl: "view.component.scss",
})
class ViewVerificationComponent extends PageComponent { }

function getPageInfo(subRoute: keyof typeof verificationMenuItems.view): IPageInfo {
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

