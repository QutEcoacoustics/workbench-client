import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { projectMenuItem } from "@components/projects/projects.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { Region } from "@models/Region";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectEditorPredicate,
} from "src/app/app.menus";
import {
  regionRoute,
  regionsRoute,
  shallowRegionsRoute,
} from "./regions.routes";

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

export const shallowNewRegionMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: shallowRegionsMenuItem,
  predicate: isProjectEditorPredicate,
  route: shallowRegionsRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const regionsCategory: Category = {
  ...shallowRegionsCategory,
  route: regionsRoute,
};

export const regionMenuItem = menuRoute({
  icon: ["fas", "map-marked-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: regionRoute,
  tooltip: () => "The current site",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, Region)?.name,
});

export const newRegionMenuItem = menuRoute({
  ...shallowNewRegionMenuItem,
  route: regionsRoute.add("new"),
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
