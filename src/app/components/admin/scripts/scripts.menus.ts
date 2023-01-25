import { RouterStateSnapshot } from "@angular/router";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import {
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
} from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminScriptsRoute = adminRoute.addFeatureModule("scripts");

export const adminScriptsCategory: Category = {
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: adminScriptsRoute,
};

export const adminScriptsMenuItem = menuRoute({
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: adminScriptsCategory.route,
  tooltip: () => "Manage custom scripts",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminNewScriptsMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Script",
  route: adminScriptsMenuItem.route.add("new"),
  tooltip: () => "Create a new script",
  parent: adminScriptsMenuItem,
  predicate: isAdminPredicate,
});

const adminScriptRoute = adminScriptsRoute.add(":scriptId");

export const adminScriptMenuItem = menuRoute({
  icon: ["fas", "scroll"],
  label: "Script",
  route: adminScriptRoute,
  tooltip: () => "Manage script",
  parent: adminScriptsMenuItem,
  predicate: isAdminPredicate,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    const scriptName = componentModel.script.model.name;
    return scriptName;
  }
});

export const adminEditScriptMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "New Version",
  route: adminScriptRoute.add("edit"),
  tooltip: () => "Create new version of this script",
  parent: adminScriptMenuItem,
  predicate: isAdminPredicate,
  title: () => CommonRouteTitles.routeEditTitle,
});
