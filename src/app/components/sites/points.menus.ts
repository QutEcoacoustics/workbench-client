import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { regionMenuItem } from "@components/regions/regions.menus";
import { Category, menuItem, menuRoute } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { defaultAnnotationDownloadIcon, isLoggedInPredicate } from "src/app/app.menus";
import { pointRoute, pointsRoute } from "./points.routes";
import {
  editSiteMenuItem,
  newSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "./sites.menus";

export const pointsCategory: Category = {
  ...sitesCategory,
  label: "Points",
  route: pointRoute,
};

export const pointMenuItem = menuRoute({
  ...siteMenuItem,
  label: "Point",
  parent: regionMenuItem,
  route: pointRoute,
  tooltip: () => "The current point",
  breadcrumbResolve: (pageInfo) => retrieveResolvedModel(pageInfo, Site)?.name,
});

export const newPointMenuItem = menuRoute({
  ...newSiteMenuItem,
  label: "New point",
  parent: regionMenuItem,
  route: pointsRoute.add("new"),
  tooltip: () => "Create a new point",
});

export const pointAnnotationsMenuItem = menuItem({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  parent: pointMenuItem,
  tooltip: () => "Download annotations for this point",
  predicate: isLoggedInPredicate,
});

export const editPointMenuItem = menuRoute({
  ...editSiteMenuItem,
  label: "Edit this point",
  parent: pointMenuItem,
  route: pointMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this point",
});
