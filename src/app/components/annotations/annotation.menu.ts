import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { isLoggedInPredicate } from "src/app/app.menus";
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
    tooltip: () => "(BETA) Verify Annotations",
    predicate: isLoggedInPredicate,
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
    tooltip: () => "(BETA) Search Annotations",
    route: annotationSearchRoute[subRoute],
    parent,
  });
}

const annotationSearchMenuitem: AnnotationMenuRoutes = {
  /** /project/:projectId/site/:siteId/annotations */
  site: makeAnnotationSearchMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations */
  siteAndRegion: makeAnnotationSearchMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/annotations */
  region: makeAnnotationSearchMenuItem("region", regionMenuItem),
  /** /project/:projectId/annotations */
  project: makeAnnotationSearchMenuItem("project", projectMenuItem),
};

const verificationMenuItem: AnnotationMenuRoutes = {
  /** /project/:projectId/site/:siteId/annotations/verify */
  site: makeVerificationMenuItem("site", annotationSearchMenuitem.site),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations/verify */
  siteAndRegion: makeVerificationMenuItem("siteAndRegion", annotationSearchMenuitem.siteAndRegion),
  /** /project/:projectId/region/:regionId/annotations/verify */
  region: makeVerificationMenuItem("region", annotationSearchMenuitem.region),
  /** /project/:projectId/annotations/verify */
  project: makeVerificationMenuItem("project", annotationSearchMenuitem.project),
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
