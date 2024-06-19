import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const verificationRouteName = "verification";

const verificationRouteQueryParamResolver = (params) =>
  params
    ? {}
    : {};

export type VerificationRoute = "project" | "region" | "site" | "siteAndRegion";
export type VerificationStrongRoute = Record<VerificationRoute, StrongRoute>;

export const verificationRoute: VerificationStrongRoute = {
  /** /project/:projectId/site/:siteId/verification */
  site: siteRoute.add(verificationRouteName, verificationRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: pointRoute.add(verificationRouteName, verificationRouteQueryParamResolver),
  /** /project/:projectId/region/:regionId/verification */
  region: regionRoute.add(verificationRouteName, verificationRouteQueryParamResolver),
  /** /project/:projectId/verification */
  project: projectRoute.add(verificationRouteName, verificationRouteQueryParamResolver),
};

export const newVerificationRoute: VerificationStrongRoute = {
  /** /project/:projectId/site/:siteId/verification/new */
  site: verificationRoute.site.add("new"),
  /** /project/:projectId/region/:regionId/site/:siteId/verification/new */
  siteAndRegion: verificationRoute.siteAndRegion.add("new"),
  /** /project/:projectId/region/:regionId/verification/new */
  region: verificationRoute.region.add("new"),
  /** /project/:projectId/verification/new */
  project: verificationRoute.project.add("new"),
};
