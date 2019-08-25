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
