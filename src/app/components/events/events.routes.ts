import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const eventsRouteName = "events";

const eventRouteQueryParamResolver = (params) =>
  params
    ? {
        query: params.query,
      }
    : {};

export type EventsRoute = "project" | "region" | "site" | "siteAndRegion";
export type EventsStrongRoutes = Record<EventsRoute, StrongRoute>;

export const eventsRoute: EventsStrongRoutes = {
  /** /project/:projectId/site/:siteId/events */
  site: siteRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/events */
  siteAndRegion: pointRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/events */
  region: regionRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/events */
  project: projectRoute.add(eventsRouteName, eventRouteQueryParamResolver),
};
