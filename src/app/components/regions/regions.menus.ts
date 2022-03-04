import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { projectMenuItem } from "@components/projects/projects.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { Region } from "@models/Region";
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
  order: 3,
});

export const regionsCategory: Category = {
  ...shallowRegionsCategory,
  route: regionsRoute,
};

export const regionMenuItem = menuRoute({
  icon: ["fas", "map-marked-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: regionsCategory.route.add(":regionId"),
  tooltip: () => "The current site",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, Region)?.name,
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
