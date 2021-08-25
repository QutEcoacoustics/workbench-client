import {
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectEditorPredicate,
} from "src/app/app.menus";

export const shallowRegionsRoute = StrongRoute.newRoot().add("regions");
export const regionsRoute = projectMenuItem.route.addFeatureModule("regions");

export const shallowRegionsCategory: Category = {
  icon: ["fas", "map-signs"],
  label: "Sites",
  route: shallowRegionsRoute,
};

export const shallowRegionsMenuItem = menuRoute({
  icon: ["fas", "map-signs"],
  label: "Sites",
  route: shallowRegionsRoute,
  tooltip: () => "View sites I have access to",
  order: projectsMenuItem.order,
});

export const regionsCategory: Category = {
  ...shallowRegionsCategory,
  route: regionsRoute,
};

export const regionsMenuItem = menuRoute({
  ...shallowRegionsMenuItem,
  parent: projectMenuItem,
  route: regionsRoute,
});

export const regionMenuItem = menuRoute({
  icon: ["fas", "map-marked-alt"],
  label: "Site",
  parent: regionsMenuItem,
  route: regionsMenuItem.route.add(":regionId"),
  tooltip: () => "The current site",
});

export const newRegionMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: regionsMenuItem,
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
