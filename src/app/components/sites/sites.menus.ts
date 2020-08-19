import { Category, MenuLink, MenuRoute } from "@interfaces/menusInterfaces";
import {
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isLoggedInPredicate,
  isProjectOwnerPredicate,
} from "src/app/app.menus";
import { projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.addFeatureModule("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute.add(":siteId"),
};

export const newSiteMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isProjectOwnerPredicate,
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const siteMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: sitesCategory.route,
  tooltip: () => "The current site",
});

export const siteAnnotationsMenuItem = MenuLink({
  icon: ["fas", "border-all"],
  label: "Download annotations",
  predicate: isLoggedInPredicate,
  tooltip: () => "Download annotations for this site",
  uri: () => "REPLACE_ME",
});

export const editSiteMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site",
});

export const harvestMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Harvesting",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this site",
});

export const deleteSiteMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Site",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("delete"),
  tooltip: () => "Delete this site",
});
