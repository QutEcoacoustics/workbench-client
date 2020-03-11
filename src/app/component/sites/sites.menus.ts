import {
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
  isLoggedInPredicate,
  isOwnerPredicate
} from "src/app/app.menus";
import {
  Category,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { projectCategory, projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.add("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute.add(":siteId"),
  parent: projectCategory,
  resolvers: {
    site: "SiteShowResolver"
  }
};

export const newSiteMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isLoggedInPredicate,
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site"
});

export const siteMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: sitesCategory.route,
  tooltip: () => "The current site"
});

export const annotationsMenuItem = MenuLink({
  icon: ["fas", "border-all"],
  label: "Download annotations",
  predicate: isLoggedInPredicate,
  tooltip: () => "Download annotations for this site",
  uri: () => "REPLACE_ME"
});

export const editSiteMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: siteMenuItem,
  predicate: isOwnerPredicate,
  route: siteMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site"
});

export const harvestMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Harvesting",
  parent: siteMenuItem,
  predicate: isAdminPredicate,
  route: siteMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this site"
});

export const deleteSiteMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Site",
  parent: siteMenuItem,
  predicate: isOwnerPredicate,
  route: siteMenuItem.route.add("delete"),
  tooltip: () => "Delete this site"
});
