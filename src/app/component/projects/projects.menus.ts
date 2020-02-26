import { List } from "immutable";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  defaultPermissionsIcon,
  isAdminPredicate,
  isLoggedInPredicate,
  isOwnerPredicate
} from "src/app/app.menus";
import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const projectsRoute = StrongRoute.Base.add("projects");

export const projectsCategory: Category = {
  label: "Projects",
  icon: ["fas", "globe-asia"],
  route: projectsRoute,
  resolvedModels: List(["projects"])
};

export const projectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "Projects",
  route: projectsRoute,
  tooltip: () => "View projects I have access to",
  order: 4
});

export const newProjectMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New project",
  route: projectsRoute.add("new"),
  tooltip: () => "Create a new project",
  predicate: isLoggedInPredicate,
  parent: projectsMenuItem
});

export const requestProjectMenuItem = MenuRoute({
  icon: defaultPermissionsIcon,
  label: "Request access",
  route: projectsRoute.add("request"),
  tooltip: () => "Request access to a project not listed here",
  predicate: isLoggedInPredicate,
  parent: projectsMenuItem
});

export const projectMenuItem = MenuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  route: projectsRoute.add(":projectId"),
  tooltip: () => "The current project",
  parent: projectsMenuItem
});

export const projectCategory: Category = {
  label: "Project",
  icon: projectsCategory.icon,
  route: projectMenuItem.route,
  resolvedModels: List(["project", "sites", ...projectsCategory.resolvedModels])
};

export const editProjectMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this project",
  route: projectMenuItem.route.add("edit"),
  parent: projectMenuItem,
  tooltip: () => "Change the details for this project",
  predicate: isOwnerPredicate
});

export const editProjectPermissionsMenuItem = MenuRoute({
  icon: defaultPermissionsIcon,
  label: "Edit permissions",
  route: projectMenuItem.route.add("permissions"),
  parent: projectMenuItem,
  tooltip: () => "Edit this projects permissions",
  predicate: isOwnerPredicate
});

export const assignSiteMenuItem = MenuRoute({
  icon: ["fas", "toolbox"],
  label: "Assign sites",
  route: projectMenuItem.route.add("assign"),
  parent: projectMenuItem,
  tooltip: () => "Change which sites belong to this project",
  predicate: isAdminPredicate
});

export const deleteProjectMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Project",
  route: projectMenuItem.route.add("delete"),
  parent: projectMenuItem,
  tooltip: () => "Delete this project",
  predicate: isOwnerPredicate
});
