import { RouterStateSnapshot } from "@angular/router";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import {
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
  isLoggedInPredicate,
} from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { scriptRoute, scriptsRoute } from "./scripts.routes";

export const adminScriptsCategory: Category = {
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: scriptsRoute,
};

export const scriptsMenuItem = menuRoute({
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: adminScriptsCategory.route,
  tooltip: () => "Manage custom scripts",
  predicate: isLoggedInPredicate,
});

export const scriptMenuItem = menuRoute({
  icon: ["fas", "scroll"],
  label: "Script",
  route: scriptRoute,
  tooltip: () => "Manage script",
  predicate: isLoggedInPredicate,
  parent: scriptsMenuItem,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    const scriptName = componentModel.script.model.name;
    return scriptName;
  }
});

export const newScriptMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Script",
  route: scriptsMenuItem.route.add("new"),
  parent: scriptsMenuItem,
  tooltip: () => "Create a new script",
  predicate: isAdminPredicate,
});

export const adminEditScriptMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "New Version",
  route: scriptRoute.add("edit"),
  tooltip: () => "Create new version of this script",
  predicate: isAdminPredicate,
  parent: scriptMenuItem,
  title: () => CommonRouteTitles.routeEditTitle,
});
