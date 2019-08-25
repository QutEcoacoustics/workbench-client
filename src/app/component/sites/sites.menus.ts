import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.add("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute
};

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

export const editSiteMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit this project",
  route: siteMenuItem.route.add("edit"),
  parent: siteMenuItem,
  tooltip: () => "Change the details for this site",
  predicate: user => !!user,
  order: {
    priority: siteMenuItem.order.priority,
    indentation: siteMenuItem.order.indentation + 1
  }
});
