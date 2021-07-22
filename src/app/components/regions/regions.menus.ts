import { projectMenuItem } from "@components/projects/projects.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectEditorPredicate,
} from "src/app/app.menus";

export const regionsRoute = projectMenuItem.route.addFeatureModule("regions");

export const regionsCategory: Category = {
  icon: ["fas", "map-signs"],
  label: "Sites",
  route: regionsRoute.add(":regionId"),
};

export const regionMenuItem = menuRoute({
  icon: ["fas", "map-signs"],
  label: "Site",
  parent: projectMenuItem,
  route: regionsCategory.route,
  tooltip: () => "The current region",
});

export const newRegionMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: regionsRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const editRegionMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: regionMenuItem,
  predicate: isProjectEditorPredicate,
  route: regionMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site",
});

export const deleteRegionMenuItem = menuRoute({
  icon: defaultDeleteIcon,
  label: "Delete site",
  parent: regionMenuItem,
  predicate: isProjectEditorPredicate,
  route: regionMenuItem.route.add("delete"),
  tooltip: () => "Delete this site",
});
