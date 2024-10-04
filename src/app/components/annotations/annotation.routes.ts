import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const annotationsRouteName = "annotations";
const verificationRouteName = "verify";

const annotationSearchRouteQueryParamResolver = (params: Record<string, string>) =>
  params
    ? {
      projects: params.projects,
      regions: params.regions,
      sites: params.sties,
      tags: params.tags,
      onlyUnverified: params.onlyUnverified,
      date: params.date,
      time: params.time,
    }
    : {};

export type AnnotationRoute = "project" | "region" | "site" | "siteAndRegion";
export type AnnotationStrongRoute = Record<AnnotationRoute, StrongRoute>;

export const annotationSearchRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/annotations */
  site: siteRoute.add(annotationsRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations */
  siteAndRegion: pointRoute.add(annotationsRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/annotations */
  region: regionRoute.add(annotationsRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/annotations */
  project: projectRoute.add(annotationsRouteName, annotationSearchRouteQueryParamResolver),
};

export const verificationRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/verification */
  site: annotationSearchRoute.site.add(verificationRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: annotationSearchRoute.siteAndRegion.add(verificationRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/verification */
  region: annotationSearchRoute.region.add(verificationRouteName, annotationSearchRouteQueryParamResolver),
  /** /project/:projectId/verification */
  project: annotationSearchRoute.project.add(verificationRouteName, annotationSearchRouteQueryParamResolver),
};
