import { projectMenuItem } from "@components/projects/projects.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { siteMenuItem } from "@components/sites/sites.menus";
import { Category, MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { isWorkInProgressPredicate } from "src/app/app.menus";
import {
  ReportRoute,
  eventReportRoute,
  newEventReportRoute,
} from "./reports.routes";

export type ReportMenuRoutes = Record<ReportRoute, MenuRoute>;

function makeEventReportCategory(subRoute: ReportRoute): Category {
  return {
    icon: ["fas", "file-lines"],
    label: "Annotation Report",
    route: eventReportRoute[subRoute],
  };
}

function makeNewReportCategory(subRoute: ReportRoute): Category {
  return {
    icon: ["fas", "file-circle-plus"],
    label: "New Annotation Report",
    route: newEventReportRoute[subRoute],
  };
}

function makeViewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute,
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-lines"],
    label: "Annotation Report",
    tooltip: () => "Annotation report",
    route: eventReportRoute[subRoute],
    predicate: isWorkInProgressPredicate,
    parent,
  });
}

function makeNewEventReportMenuItem(
  subRoute: ReportRoute,
  parent?: MenuRoute,
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-circle-plus"],
    label: "New Annotation Report",
    tooltip: () => "New annotation report",
    route: newEventReportRoute[subRoute],
    predicate: isWorkInProgressPredicate,
    parent,
  });
}

const viewReportMenuItem: ReportMenuRoutes = {
  /** /project/:projectId/site/:siteId/reports/annotations */
  site: makeViewEventReportMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/reports/annotations */
  siteAndRegion: makeViewEventReportMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/reports/annotations */
  region: makeViewEventReportMenuItem("region", regionMenuItem),
  /** /project/:projectId/reports/annotations */
  project: makeViewEventReportMenuItem("project", projectMenuItem),
};

const newReportMenuItem: ReportMenuRoutes = {
  /** /project/:projectId/site/:siteId/reports/annotations/new */
  site: makeNewEventReportMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/reports/annotations/new */
  siteAndRegion: makeNewEventReportMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/reports/annotations/new */
  region: makeNewEventReportMenuItem("region", regionMenuItem),
  /** /project/:projectId/reports/annotations/new */
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
