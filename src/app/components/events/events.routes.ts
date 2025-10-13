import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

// In the client UI, events are typically referred to as "annotations".
// Therefore, I have named the route "annotation-map" so that the url is
// readable and meaningful to the the user.
const eventsRouteName = "annotation-map";

const eventRouteQueryParamResolver = (params) =>
  params
    ? {
        audioRecordings: params.audioRecordings,
        tags: params.tags,
        importFiles: params.importFiles,
        score: params.score,

        projects: params.projects,
        regions: params.regions,
        sites: params.sites,

        date: params.date,
        time: params.time,

        sort: params.sort,
      }
    : {};

export type EventsRoute = "project" | "region" | "site" | "siteAndRegion";
export type EventsStrongRoutes = Record<EventsRoute, StrongRoute>;

export const eventsRoute: EventsStrongRoutes = {
  /** /project/:projectId/site/:siteId/annotation-map */
  site: siteRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/annotation-map */
  siteAndRegion: pointRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/annotation-map */
  region: regionRoute.add(eventsRouteName, eventRouteQueryParamResolver),
  /** /project/:projectId/annotation-map */
  project: projectRoute.add(eventsRouteName, eventRouteQueryParamResolver),
};
