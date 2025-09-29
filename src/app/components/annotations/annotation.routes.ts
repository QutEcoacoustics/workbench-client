import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { isLoggedInGuard } from "@guards/security/is-logged-in/is-logged-in.guard";
import { identityQspResolver, StrongRoute } from "@interfaces/strongRoute";

const annotationsRouteName = "annotations";
const verificationRouteName = "verify";

export type AnnotationRoute = "project" | "region" | "site" | "siteAndRegion";
export type AnnotationStrongRoute = Record<AnnotationRoute, StrongRoute>;

export const annotationSearchRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/annotations */
  site: siteRoute.add(annotationsRouteName),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations */
  siteAndRegion: pointRoute.add(annotationsRouteName),
  /** /project/:projectId/region/:regionId/annotations */
  region: regionRoute.add(annotationsRouteName),
  /** /project/:projectId/annotations */
  project: projectRoute.add(annotationsRouteName),
};

const verificationRouteGuards = [isLoggedInGuard];

export const verificationRoute: AnnotationStrongRoute = {
  /** /project/:projectId/site/:siteId/annotations/verify */
  site: annotationSearchRoute.site.add(
    verificationRouteName,
    identityQspResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations/verify */
  siteAndRegion: annotationSearchRoute.siteAndRegion.add(
    verificationRouteName,
    identityQspResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/region/:regionId/annotations/verify */
  region: annotationSearchRoute.region.add(
    verificationRouteName,
    identityQspResolver,
    { canActivate: verificationRouteGuards },
  ),
  /** /project/:projectId/annotations/verify */
  project: annotationSearchRoute.project.add(
    verificationRouteName,
    identityQspResolver,
    { canActivate: verificationRouteGuards },
  ),
};
