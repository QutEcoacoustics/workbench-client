import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { isLoggedInGuard } from "@guards/security/is-logged-in/is-logged-in.guard";
import { StrongRoute } from "@interfaces/strongRoute";

const annotationsRouteName = "annotations";
const verificationRouteName = "verify";

const annotationSearchRouteQueryParamResolver = (
  params: Record<string, string>,
) =>
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

        taskTag: params.taskTag,
        taskBehavior: params.taskBehavior,
        verificationStatus: params.verificationStatus,
      }
    : {};

export type AnnotationRoute = "project" | "region" | "site" | "siteAndRegion";
export type AnnotationStrongRoute = Record<AnnotationRoute, StrongRoute>;

export const annotationSearchRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/annotations */
  site: siteRoute.add(
    annotationsRouteName,
    annotationSearchRouteQueryParamResolver,
  ),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations */
  siteAndRegion: pointRoute.add(
    annotationsRouteName,
    annotationSearchRouteQueryParamResolver,
  ),
  /** /project/:projectId/region/:regionId/annotations */
  region: regionRoute.add(
    annotationsRouteName,
    annotationSearchRouteQueryParamResolver,
  ),
  /** /project/:projectId/annotations */
  project: projectRoute.add(
    annotationsRouteName,
    annotationSearchRouteQueryParamResolver,
  ),
};

const verificationRouteGuards = [isLoggedInGuard];

export const verificationRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/annotations/verify */
  site: annotationSearchRoute.site.add(
    verificationRouteName,
    annotationSearchRouteQueryParamResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations/verify */
  siteAndRegion: annotationSearchRoute.siteAndRegion.add(
    verificationRouteName,
    annotationSearchRouteQueryParamResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/region/:regionId/annotations/verify */
  region: annotationSearchRoute.region.add(
    verificationRouteName,
    annotationSearchRouteQueryParamResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/annotations/verify */
  project: annotationSearchRoute.project.add(
    verificationRouteName,
    annotationSearchRouteQueryParamResolver,
    { canActivate: verificationRouteGuards },
  ),
};
