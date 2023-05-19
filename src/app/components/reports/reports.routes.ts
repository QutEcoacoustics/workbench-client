import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const eventSummaryReportName = "event-summary";

export type ReportRoute = "project" | "region" | "site" | "siteAndRegion";
export type ReportStrongRoutes = Record<ReportRoute, StrongRoute>;

export const reportsRoute: ReportStrongRoutes = {
  project: projectRoute.add("reports"),
  region: regionRoute.add("reports"),
  site: siteRoute.add("reports"),
  siteAndRegion: pointRoute.add("reports"),
};

export const eventReportRoute: ReportStrongRoutes = {
  project: reportsRoute.project.add(eventSummaryReportName),
  region: reportsRoute.region.add(eventSummaryReportName),
  site: reportsRoute.site.add(eventSummaryReportName),
  siteAndRegion: reportsRoute.siteAndRegion.add(eventSummaryReportName),
};

export const newEventReportRoute: ReportStrongRoutes = {
  project: eventReportRoute.project.add("new"),
  region: eventReportRoute.region.add("new"),
  site: eventReportRoute.site.add("new"),
  siteAndRegion: eventReportRoute.siteAndRegion.add("new"),
};
