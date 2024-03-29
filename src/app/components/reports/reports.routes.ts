import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const eventSummaryReportRouteName = "event_summary";

const summaryReportRouteQueryParamResolver = (params) =>
  params
    ? {
        sites: params.sites,
        points: params.points,
        provenances: params.provenances,
        tags: params.tags,
        score: params.score,
        bucketSize: params.bucketSize,
        daylightSavings: params.daylightSavings,
        date: params.date,
        time: params.time,
        charts: params.charts,
    }
    : {};

export type ReportRoute = "project" | "region" | "site" | "siteAndRegion";
export type ReportStrongRoutes = Record<ReportRoute, StrongRoute>;

export const reportsRoute: ReportStrongRoutes = {
  /** /project/:projectId/site/:siteId/reports */
  site: siteRoute.add("reports"),
  /** /project/:projectId/region/:regionId/site/:siteId/reports */
  siteAndRegion: pointRoute.add("reports"),
  /** /project/:projectId/region/:regionId/reports */
  region: regionRoute.add("reports"),
  /** /project/:projectId/reports */
  project: projectRoute.add("reports"),
};

export const eventReportRoute: ReportStrongRoutes = {
  /** /project/:projectId/site/:siteId/reports/event-summary */
  site: reportsRoute.site.add(eventSummaryReportRouteName, summaryReportRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/reports/event-summary */
  region: reportsRoute.region.add(eventSummaryReportRouteName, summaryReportRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/reports/event-summary */
  siteAndRegion: reportsRoute.siteAndRegion.add(eventSummaryReportRouteName, summaryReportRouteQueryParamResolver),
  /** /project/:projectId/reports/event-summary */
  project: reportsRoute.project.add(eventSummaryReportRouteName, summaryReportRouteQueryParamResolver),
};

export const newEventReportRoute: ReportStrongRoutes = {
  /** /project/:projectId/site/:siteId/reports/event-summary/new */
  site: eventReportRoute.site.add("new"),
  /** /projects/:projectId/region/:regionId/reports/event-summary-new */
  region: eventReportRoute.region.add("new"),
  /** /projects/:projectId/region/:regionId/site/:siteId/reports/event-summary/new */
  siteAndRegion: eventReportRoute.siteAndRegion.add("new"),
  /** /projects/:projectId/reports/event-summary/new */
  project: eventReportRoute.project.add("new"),
};
