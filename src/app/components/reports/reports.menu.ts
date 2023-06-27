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
    label: "New Event Report",
    tooltip: () => "New event summary report",
    route: newEventReportRoute[subRoute],
    parent,
    predicate: isAdminPredicate,
  });
}

const viewReportMenuItem: ReportMenuRoutes = {
  project: makeViewEventReportMenuItem("project", projectMenuItem),
  region: makeViewEventReportMenuItem("region", regionMenuItem),
  site: makeViewEventReportMenuItem("site", siteMenuItem),
  siteAndRegion: makeViewEventReportMenuItem("siteAndRegion", pointMenuItem),
};

const newReportMenuItem: ReportMenuRoutes = {
  project: makeNewEventReportMenuItem("project", projectMenuItem),
  region: makeNewEventReportMenuItem("region", regionMenuItem),
  site: makeNewEventReportMenuItem("site", siteMenuItem),
  siteAndRegion: makeNewEventReportMenuItem(
    "siteAndRegion",
    pointMenuItem
  ),
};

const viewReportCategory = {
  project: makeEventReportCategory("project"),
  region: makeEventReportCategory("region"),
  site: makeEventReportCategory("site"),
  siteAndRegion: makeEventReportCategory("siteAndRegion"),
};

const newReportCategory = {
  project: makeNewReportCategory("project"),
  region: makeNewReportCategory("region"),
  site: makeNewReportCategory("site"),
  siteAndRegion: makeNewReportCategory("siteAndRegion"),
};

export const reportCategories = {
  new: newReportCategory,
  view: viewReportCategory,
};

export const reportMenuItems = {
  new: newReportMenuItem,
  view: viewReportMenuItem,
};
