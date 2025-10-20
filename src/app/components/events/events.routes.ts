import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

// In the client UI, events are typically referred to as "annotations".
// Therefore, I have named the route "annotation-map" so that the url is
// readable and meaningful to the the user.
const eventsRouteName = "annotation-map";

const annotationMapRouteQueryParamResolver = (params) =>
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

        focused: params.focused,
      }
    : {};

export type AnnotationMapRoute = "project" | "region" | "site" | "siteAndRegion";
export type AnnotationMapStrongRoutes = Record<AnnotationMapRoute, StrongRoute>;

export const annotationMapRoute: AnnotationMapStrongRoutes = {
  /** /project/:projectId/site/:siteId/annotation-map */
  site: siteRoute.add(eventsRouteName, annotationMapRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/annotation-map */
  siteAndRegion: pointRoute.add(eventsRouteName, annotationMapRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/annotation-map */
  region: regionRoute.add(eventsRouteName, annotationMapRouteQueryParamResolver),
  /** /project/:projectId/annotation-map */
  project: projectRoute.add(eventsRouteName, annotationMapRouteQueryParamResolver),
};
