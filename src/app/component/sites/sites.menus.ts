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
  icon: ["fas", "plus"],
  label: "New site",
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
  predicate: user => !!user,
  parent: projectMenuItem,
  order: {
    priority: projectMenuItem.order.priority,
    indentation: projectMenuItem.order.indentation + 1
  }
});

export const siteMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  route: sitesRoute.add(":siteId"),
  tooltip: () => "The current site",
  parent: projectMenuItem,
  order: {
    priority: projectMenuItem.order.priority,
    indentation: projectMenuItem.order.indentation + 1
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
  predicate: user => !!user
});

export const editSiteMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit this site",
  route: siteMenuItem.route.add("edit"),
  parent: siteMenuItem,
  tooltip: () => "Change the details for this site",
  predicate: user => !!user,
  order: {
    priority: siteMenuItem.order.priority,
    indentation: siteMenuItem.order.indentation + 1
  }
});

export const harvestMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "file-audio"],
  label: "How to harvest",
  tooltip: () => "Upload new audio to this site",
  predicate: user => !!user
});

export const assignSiteMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "toolbox"],
  label: "Assign site",
  tooltip: () => "Change which sites belong to this project",
  predicate: user => !!user
});

export const deleteSiteMenuItem = MenuRoute({
  icon: ["fas", "trash"],
  label: "Delete Site",
  route: siteMenuItem.route.add("delete"),
  parent: siteMenuItem,
  tooltip: () => "Delete this site",
  predicate: user => !!user,
  order: {
    priority: siteMenuItem.order.priority,
    indentation: siteMenuItem.order.indentation + 1
  }
});
