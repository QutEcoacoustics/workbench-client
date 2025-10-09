import { Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { EventMapComponent } from "@shared/event-map/event-map.component";
import { eventCategories, eventMenuitems } from "../../events.menus";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-events-map-page",
  templateUrl: "./events.component.html",
  styleUrl: "./events.component.scss",
  imports: [EventMapComponent],
})
class EventsPageComponent extends PageComponent {}

function getPageInfo(subRoute: keyof typeof eventMenuitems.map): IPageInfo {
  return {
    pageRoute: eventMenuitems.map[subRoute],
    category: eventCategories.map[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
    fullscreen: true,
  };
}

EventsPageComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { EventsPageComponent };
