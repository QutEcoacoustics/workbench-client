import { Category, MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { projectMenuItem } from "@components/projects/projects.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import {
  ReportRoute,
  newEventReportRoute,
  eventReportRoute,
} from "./reports.routes";

export type ReportMenuRoutes = Record<ReportRoute, MenuRoute>;

export const newReportCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Generate Summary Report",
  route: newEventReportRoute.project,
};

export const viewReportCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Summary Report",
  route: eventReportRoute.project,
};

function makeViewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file"],
    label: "Summary Report",
    tooltip: () => "View event summary report",
    route: eventReportRoute[subRoute],
    parent,
  });
}

function makeNewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file"],
    label: "Create Event Report",
    tooltip: () => "Create event summary report",
    route: newEventReportRoute[subRoute],
    parent,
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

export const reportMenuItems = {
  new: newReportMenuItem,
  view: viewReportMenuItem,
};
