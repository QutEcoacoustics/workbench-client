import { projectMenuItem } from "@components/projects/projects.menus";
import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectOwnerPredicate,
} from "src/app/app.menus";

export const regionsRoute = projectMenuItem.route.addFeatureModule("regions");

export const regionsCategory: Category = {
  label: "Regions",
  icon: ["fas", "map-signs"],
  route: regionsRoute.add(":regionId"),
};

export const regionMenuItem = MenuRoute({
  icon: ["fas", "map-signs"],
  label: "Regions",
  route: regionsCategory.route,
  tooltip: () => "The current region",
});

export const newRegionMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New region",
  parent: projectMenuItem,
  predicate: isProjectOwnerPredicate,
  route: regionsRoute.add("new"),
  tooltip: () => "Create a new region",
});

export const editRegionMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this region",
  parent: regionMenuItem,
  predicate: isProjectOwnerPredicate,
  route: regionMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this region",
});

export const deleteRegionMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete region",
  parent: regionMenuItem,
  predicate: isProjectOwnerPredicate,
  route: regionMenuItem.route.add("delete"),
  tooltip: () => "Delete this region",
});
