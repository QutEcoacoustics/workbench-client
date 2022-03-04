import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Category, menuItem, menuRoute } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import {
  defaultAnnotationDownloadIcon,
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectEditorPredicate,
} from "src/app/app.menus";
import { projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.addFeatureModule("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute.add(":siteId"),
};

export const siteMenuItem = menuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: sitesCategory.route,
  tooltip: () => "The current site",
  breadcrumbResolve: (pageInfo) => retrieveResolvedModel(pageInfo, Site)?.name,
});

export const newSiteMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const siteAnnotationsMenuItem = menuItem({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  parent: siteMenuItem,
  tooltip: () => "Download annotations for this site",
});

export const editSiteMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: siteMenuItem,
  predicate: isProjectEditorPredicate,
  route: siteMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site",
});

export const siteHarvestMenuItem = menuRoute({
  icon: defaultAudioIcon,
  label: "Harvesting",
  parent: siteMenuItem,
  predicate: isProjectEditorPredicate,
  route: siteMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this site",
});

export const deleteSiteMenuItem = menuRoute({
  icon: defaultDeleteIcon,
  label: "Delete site",
  parent: siteMenuItem,
  predicate: isProjectEditorPredicate,
  route: siteMenuItem.route.add("delete"),
  tooltip: () => "Delete this site",
});
