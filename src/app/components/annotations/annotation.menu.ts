import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { isLoggedInPredicate, isWorkInProgressPredicate } from "src/app/app.menus";
import { annotationSearchRoute, verificationRoute, AnnotationRoute, annotationMapRoute } from "./annotation.routes";

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

function makeAnnotationMapCategory(subRoute: AnnotationRoute): Category {
  return {
    icon: ["fas", "bullseye"],
    label: "Events",
    route: annotationMapRoute[subRoute],
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

function makeAnnotationMapMenuItem(
  subRoute: AnnotationRoute,
  parent?: MenuRoute,
) {
  return menuRoute({
    icon: ["fas", "bullseye"],
    label: "Annotation Map",
    tooltip: () => "Annotation Map",
    // TODO: Remove this predicate once the we have an API backed event-map
    // see: https://github.com/QutEcoacoustics/baw-server/issues/852
    predicate: isWorkInProgressPredicate,
    route: annotationMapRoute[subRoute],
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

const annotationMapMenuItem: AnnotationMenuRoutes = {
  /** /project/:projectId/site/:siteId/annotations/map */
  site: makeAnnotationMapMenuItem("site", annotationSearchMenuitem.site),
  /** /project/:projectId/region/:regionId/site/:siteId/annotations/map */
  siteAndRegion: makeAnnotationMapMenuItem("siteAndRegion", annotationSearchMenuitem.siteAndRegion),
  /** /project/:projectId/region/:regionId/annotations/map */
  region: makeAnnotationMapMenuItem("region", annotationSearchMenuitem.region),
  /** /project/:projectId/annotations/map */
  project: makeAnnotationMapMenuItem("project", annotationSearchMenuitem.project),
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

const annotationMapCategory = {
  site: makeAnnotationMapCategory("site"),
  siteAndRegion: makeAnnotationMapCategory("siteAndRegion"),
  region: makeAnnotationMapCategory("region"),
  project: makeAnnotationMapCategory("project"),
};

export const annotationCategories = {
  search: annotationSearchCategory,
  verify: verificationCategory,
  map: annotationMapCategory,
};

export const annotationMenuItems = {
  search: annotationSearchMenuitem,
  verify: verificationMenuItem,
  map: annotationMapMenuItem,
};
