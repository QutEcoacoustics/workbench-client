import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  newSiteMenuItem,
  siteHarvestMenuItem,
  siteMenuItem,
  sitesCategory,
} from "./sites.menus";

export const pointsRoute = regionMenuItem.route.addFeatureModule("points");

export const pointsCategory: Category = {
  ...sitesCategory,
  label: "Points",
  route: pointsRoute.add(":siteId"),
};

export const pointMenuItem = menuRoute({
  ...siteMenuItem,
  label: "Point",
  parent: regionMenuItem,
  route: pointsCategory.route,
  tooltip: () => "The current point",
});

export const newPointMenuItem = menuRoute({
  ...newSiteMenuItem,
  label: "New point",
  parent: regionMenuItem,
  route: pointsRoute.add("new"),
  tooltip: () => "Create a new point",
});

// TODO Add site id, region id, and project id to route params
export const pointAnnotationsMenuItem = MenuRoute({
  ...dataRequestMenuItem,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this point",
});

export const editPointMenuItem = menuRoute({
  ...editSiteMenuItem,
  label: "Edit this point",
  parent: pointMenuItem,
  route: pointMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this point",
});

export const pointHarvestMenuItem = menuRoute({
  ...siteHarvestMenuItem,
  parent: pointMenuItem,
  route: pointMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this point",
});

export const deletePointMenuItem = menuRoute({
  ...deleteSiteMenuItem,
  label: "Delete point",
  parent: pointMenuItem,
  route: pointMenuItem.route.add("delete"),
  tooltip: () => "Delete this point",
});
