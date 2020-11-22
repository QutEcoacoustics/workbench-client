import { projectMenuItem } from "@components/projects/projects.menus";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  newSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "@components/sites/sites.menus";
import { Category, MenuRoute } from "@interfaces/menusInterfaces";

export const regionsRoute = projectMenuItem.route.addFeatureModule("regions");

export const regionsCategory: Category = {
  ...sitesCategory,
  icon: ["fas", "map-signs"],
  route: regionsRoute.add(":regionId"),
};

export const regionMenuItem = MenuRoute({
  ...siteMenuItem,
  icon: ["fas", "map-signs"],
  route: regionsCategory.route,
});

export const newRegionMenuItem = MenuRoute({
  ...newSiteMenuItem,
  route: regionsRoute.add("new"),
});

export const editRegionMenuItem = MenuRoute({
  ...editSiteMenuItem,
  parent: regionMenuItem,
  route: regionMenuItem.route.add("edit"),
});

export const deleteRegionMenuItem = MenuRoute({
  ...deleteSiteMenuItem,
  parent: regionMenuItem,
  route: regionMenuItem.route.add("delete"),
});
