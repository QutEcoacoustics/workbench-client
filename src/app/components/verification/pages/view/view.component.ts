import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { VerificationSearch } from "@components/verification/components/annotation-search-form/annotation-search-form.component";
import { verificationMenuItems } from "@components/verification/verification.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { IconName, IconPrefix, IconProp } from "@fortawesome/fontawesome-svg-core";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-verification",
  templateUrl: "view.component.html",
  styleUrl: "view.component.scss",
})
class ViewVerificationComponent extends PageComponent {
  public constructor() {
    super();
  }

  protected searchParameters: VerificationSearch = {};
  protected areParametersCollapsed = true;

  protected get chevronIcon(): IconProp {
    const prefix: IconPrefix = "fas" as const;
    const name: IconName = this.areParametersCollapsed ? "chevron-down" : "chevron-up";
    return [prefix, name];
  }

  protected toggleParameters(): void {
    this.areParametersCollapsed = !this.areParametersCollapsed;
  }
}

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

