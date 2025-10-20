import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { isAdminPredicate } from "src/app/app.menus";
import { annotationMapRoute, AnnotationMapRoute } from "./events.routes";

export type EventMenuRoutes = Record<AnnotationMapRoute, MenuRoute>;

function makeAnnotationMapCategory(subRoute: AnnotationMapRoute): Category {
  return {
    icon: ["fas", "bullseye"],
    label: "Events",
    route: annotationMapRoute[subRoute],
  };
}

function makeAnnotationMapMenuItem(
  subRoute: AnnotationMapRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "bullseye"],
    label: "Annotation Map",
    tooltip: () => "Annotation Map",
    // TODO: Remove this predicate once the we have an API backed event-map
    // see: https://github.com/QutEcoacoustics/baw-server/issues/852
    predicate: isAdminPredicate,
    route: annotationMapRoute[subRoute],
    parent,
  });
}

const annotationMapRoutes: EventMenuRoutes = {
  /** /project/:projectId/site/:siteId/events */
  site: makeAnnotationMapMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/events */
  siteAndRegion: makeAnnotationMapMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/events */
  region: makeAnnotationMapMenuItem("region", regionMenuItem),
  /** /project/:projectId/events */
  project: makeAnnotationMapMenuItem("project", projectMenuItem),
};

const annotationMapCategory = {
  site: makeAnnotationMapCategory("site"),
  siteAndRegion: makeAnnotationMapCategory("siteAndRegion"),
  region: makeAnnotationMapCategory("region"),
  project: makeAnnotationMapCategory("project"),
};

export const annotationMapCategories = {
  map: annotationMapCategory,
};

export const annotationMapMenuitems = {
  map: annotationMapRoutes,
};
