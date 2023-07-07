import { Category, MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { projectMenuItem } from "@components/projects/projects.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { isAdminPredicate } from "src/app/app.menus";
import {
  ReportRoute,
  newEventReportRoute,
  eventReportRoute,
} from "./reports.routes";

export type ReportMenuRoutes = Record<ReportRoute, MenuRoute>;

function makeEventReportCategory(subRoute: ReportRoute): Category {
  return {
    icon: ["fas", "map-marker-alt"],
    label: "Event Summary Report",
    route: eventReportRoute[subRoute],
  };
}

function makeNewReportCategory(subRoute: ReportRoute): Category {
  return {
    icon: ["fas", "map-marker-alt"],
    label: "New Event Summary Report",
    route: newEventReportRoute[subRoute],
  };
}

function makeViewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file"],
    label: "Event Summary Report",
    tooltip: () => "View event summary report",
    route: eventReportRoute[subRoute],
    parent,
    predicate: isAdminPredicate,
  });
}

function makeNewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file"],
    label: "New Event Summary Report",
    tooltip: () => "New event summary report",
    route: newEventReportRoute[subRoute],
    parent,
    predicate: isAdminPredicate,
  });
}

const viewReportMenuItem: ReportMenuRoutes = {
  /** /project/:projectId/site/:siteId/reports/event-summary */
  site: makeViewEventReportMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/reports/event-summary */
  siteAndRegion: makeViewEventReportMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/reports/event-summary */
  region: makeViewEventReportMenuItem("region", regionMenuItem),
  /** /project/:projectId/reports/event-summary */
  project: makeViewEventReportMenuItem("project", projectMenuItem),
};

const newReportMenuItem: ReportMenuRoutes = {
  /** /project/:projectId/site/:siteId/reports/event-summary/new */
  site: makeNewEventReportMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/reports/event-summary/new */
  siteAndRegion: makeNewEventReportMenuItem("siteAndRegion",pointMenuItem),
  /** /project/:projectId/region/:regionId/reports/event-summary/new */
  region: makeNewEventReportMenuItem("region", regionMenuItem),
  /** /project/:projectId/reports/event-summary/new */
  project: makeNewEventReportMenuItem("project", projectMenuItem),
};

const viewReportCategory = {
  site: makeEventReportCategory("site"),
  siteAndRegion: makeEventReportCategory("siteAndRegion"),
  region: makeEventReportCategory("region"),
  project: makeEventReportCategory("project"),
};

const newReportCategory = {
  site: makeNewReportCategory("site"),
  siteAndRegion: makeNewReportCategory("siteAndRegion"),
  region: makeNewReportCategory("region"),
  project: makeNewReportCategory("project"),
};

export const reportCategories = {
  new: newReportCategory,
  view: viewReportCategory,
};

export const reportMenuItems = {
  new: newReportMenuItem,
  view: viewReportMenuItem,
};
