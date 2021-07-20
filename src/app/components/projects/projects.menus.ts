import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  defaultPermissionsIcon,
  isAdminPredicate,
  isLoggedInPredicate,
  isProjectEditorPredicate,
} from "src/app/app.menus";

/*
  Projects Category
*/
export const projectsRoute = StrongRoute.newRoot().add("projects");
export const projectsCategory: Category = {
  label: "Projects",
  icon: ["fas", "globe-asia"],
  route: projectsRoute,
};

export const projectsMenuItem = menuRoute({
  icon: ["fas", "globe-asia"],
  label: "Projects",
  order: 4,
  route: projectsRoute,
  tooltip: () => "View projects I have access to",
});

export const newProjectMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New project",
  parent: projectsMenuItem,
  predicate: isLoggedInPredicate,
  route: projectsRoute.add("new"),
  tooltip: () => "Create a new project",
});

export const requestProjectMenuItem = menuRoute({
  icon: defaultPermissionsIcon,
  label: "Request access",
  parent: projectsMenuItem,
  predicate: isLoggedInPredicate,
  route: projectsRoute.add("request"),
  tooltip: () => "Request access to a project not listed here",
});

/*
  Project Category
*/

export const projectCategory: Category = {
  label: "Project",
  icon: projectsCategory.icon,
  route: projectsRoute.add(":projectId"),
};

export const projectMenuItem = menuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  parent: projectsMenuItem,
  route: projectCategory.route,
  tooltip: () => "The current project",
});

export const editProjectMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this project",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: projectMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this project",
});

export const editProjectPermissionsMenuItem = menuRoute({
  icon: defaultPermissionsIcon,
  label: "Edit permissions",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: projectMenuItem.route.add("permissions"),
  tooltip: () => "Edit this projects permissions",
});

export const assignSiteMenuItem = menuRoute({
  icon: ["fas", "toolbox"],
  label: "Assign sites",
  parent: projectMenuItem,
  // This is an admin only tool
  predicate: isAdminPredicate,
  route: projectMenuItem.route.add("assign"),
  tooltip: () => "Change which sites belong to this project",
});

export const deleteProjectMenuItem = menuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Project",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: projectMenuItem.route.add("delete"),
  tooltip: () => "Delete this project",
});

export const harvestProjectMenuItem = menuRoute({
  icon: defaultAudioIcon,
  label: "Harvest Data",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: projectMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this project",
});
