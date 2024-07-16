import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { annotationSearchRoute, verificationRoute, AnnotationRoute } from "./annotation.routes";

export type AnnotationMenuRoutes = Record<AnnotationRoute, MenuRoute>;

function makeVerificationCategory(subRoute: AnnotationRoute): Category {
  return {
    icon: ["fas", "circle-check"],
    label: "Verification",
    route: verificationRoute[subRoute],
  };
}

function makeAnnotationSearchCategory(subRoute: AnnotationRoute): Category {
  return {
    icon: ["fas", "layer-group"],
    label: "Annotations",
    route: annotationSearchRoute[subRoute],
  };
}

function makeVerificationMenuItem(
  subRoute: AnnotationRoute,
  parent?: MenuRoute,
) {
  return menuRoute({
    icon: ["fas", "circle-check"],
    label: "Verify Annotations",
    tooltip: () => "Verify Annotations",
    route: verificationRoute[subRoute],
    parent,
  });
}

function makeAnnotationSearchMenuItem(
  subRoute: AnnotationRoute,
  parent?: MenuRoute,
) {
  return menuRoute({
    icon: ["fas", "layer-group"],
    label: "Search Annotations",
    tooltip: () => "Search Annotations",
    route: annotationSearchRoute[subRoute],
    parent,
  });
}

const verificationMenuItem: AnnotationMenuRoutes = {
  /** /project/:projectId/site/:siteId/verification */
  site: makeVerificationMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: makeVerificationMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/verification */
  region: makeVerificationMenuItem("region", regionMenuItem),
  /** /project/:projectId/verification */
  project: makeVerificationMenuItem("project", projectMenuItem),
};

const annotationSearchMenuitem: AnnotationMenuRoutes = {
  /** /project/:projectId/site/:siteId/verification */
  site: makeAnnotationSearchMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: makeAnnotationSearchMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/verification */
  region: makeAnnotationSearchMenuItem("region", regionMenuItem),
  /** /project/:projectId/verification */
  project: makeAnnotationSearchMenuItem("project", projectMenuItem),
};

const verificationCategory = {
  site: makeVerificationCategory("site"),
  siteAndRegion: makeVerificationCategory("siteAndRegion"),
  region: makeVerificationCategory("region"),
  project: makeVerificationCategory("project"),
};

const annotationSearchCategory = {
  site: makeAnnotationSearchCategory("site"),
  siteAndRegion: makeAnnotationSearchCategory("siteAndRegion"),
  region: makeAnnotationSearchCategory("region"),
  project: makeAnnotationSearchCategory("project"),
};

export const annotationCategories = {
  search: annotationSearchCategory,
  verify: verificationCategory,
};

export const annotationMenuItems = {
  search: annotationSearchMenuitem,
  verify: verificationMenuItem,
};
