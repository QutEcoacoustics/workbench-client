import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { eventsRoute, EventsRoute } from "./events.routes";

export type EventMenuRoutes = Record<EventsRoute, MenuRoute>;

function makeEventsCategory(subRoute: EventsRoute): Category {
  return {
    icon: ["fas", "bullseye"],
    label: "Events",
    route: eventsRoute[subRoute],
  };
}

function makeEventsReportMenuItem(
  subRoute: EventsRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "bullseye"],
    label: "Events Map",
    tooltip: () => "Events Map",
    route: eventsRoute[subRoute],
    parent,
  });
}

const eventMapRoutes: EventMenuRoutes = {
  /** /project/:projectId/site/:siteId/events */
  site: makeEventsReportMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/events */
  siteAndRegion: makeEventsReportMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/events */
  region: makeEventsReportMenuItem("region", regionMenuItem),
  /** /project/:projectId/events */
  project: makeEventsReportMenuItem("project", projectMenuItem),
};

const eventMapCategory = {
  site: makeEventsCategory("site"),
  siteAndRegion: makeEventsCategory("siteAndRegion"),
  region: makeEventsCategory("region"),
  project: makeEventsCategory("project"),
};

export const eventCategories = {
  map: eventMapCategory,
};

export const eventMenuitems = {
  map: eventMapRoutes,
};
