import {
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
import { projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.add("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute
};

export const newSiteMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New site",
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
  predicate: isLoggedInPredicate,
  parent: projectMenuItem,
  order: {
    priority: projectMenuItem.order.priority
  }
});

export const siteMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  route: sitesRoute.add(":siteId"),
  tooltip: () => "The current site",
  parent: projectMenuItem,
  order: {
    priority: projectMenuItem.order.priority
  }
});

export const exploreAudioSiteMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "map"],
  label: "Explore audio",
  tooltip: () => "Explore audio"
});

export const annotationsMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "table"],
  label: "Download annotations",
  tooltip: () => "Download annotations for this site",
  predicate: isLoggedInPredicate
});

export const editSiteMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  route: siteMenuItem.route.add("edit"),
  parent: siteMenuItem,
  tooltip: () => "Change the details for this site",
  predicate: isOwnerPredicate,
  order: {
    priority: siteMenuItem.order.priority
  }
});

export const harvestMenuItem = MenuRoute({
  icon: ["fas", "file-audio"],
  label: "Harvesting",
  route: siteMenuItem.route.add("harvest"),
  parent: siteMenuItem,
  tooltip: () => "Upload new audio to this site",
  predicate: isAdminPredicate,
  order: {
    priority: siteMenuItem.order.priority
  }
});

export const assignSiteMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "toolbox"],
  label: "Assign site",
  tooltip: () => "Change which sites belong to this project",
  predicate: isAdminPredicate
});

export const deleteSiteMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Site",
  route: siteMenuItem.route.add("delete"),
  parent: siteMenuItem,
  tooltip: () => "Delete this site",
  predicate: isOwnerPredicate,
  order: {
    priority: siteMenuItem.order.priority
  }
});
