import { projectMenuItem } from "@components/projects/projects.menus";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  newSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "@components/sites/sites.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";

export const regionsRoute = projectMenuItem.route.addFeatureModule("regions");

export const regionsCategory: Category = {
  ...sitesCategory,
  icon: ["fas", "map-signs"],
  route: regionsRoute.add(":regionId"),
};

export const regionMenuItem = menuRoute({
  ...siteMenuItem,
  icon: ["fas", "map-signs"],
  route: regionsCategory.route,
});

export const newRegionMenuItem = menuRoute({
  ...newSiteMenuItem,
  route: regionsRoute.add("new"),
});

export const editRegionMenuItem = menuRoute({
  ...editSiteMenuItem,
  parent: regionMenuItem,
  route: regionMenuItem.route.add("edit"),
});

export const deleteRegionMenuItem = menuRoute({
  ...deleteSiteMenuItem,
  parent: regionMenuItem,
  route: regionMenuItem.route.add("delete"),
});
