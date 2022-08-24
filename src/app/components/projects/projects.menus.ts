import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  defaultPermissionsIcon,
  isAdminPredicate,
  isLoggedInPredicate,
  isProjectEditorPredicate,
} from "src/app/app.menus";
import {
  editProjectPermissionsRoute,
  projectRoute,
  projectsRoute,
} from "./projects.routes";

/*
  Projects Category
*/
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
  route: projectRoute,
};

export const projectMenuItem = menuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  parent: projectsMenuItem,
  route: projectRoute,
  tooltip: () => "The current project",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, Project)?.name,
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
  route: editProjectPermissionsRoute,
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

export const uploadAnnotationsProjectMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Batch Upload Annotations",
  parent: projectMenuItem,
  // TODO Change to isProjectEditorPredicate
  predicate: isAdminPredicate,
  route: projectMenuItem.route.add("batch-annotations"),
  tooltip: () =>
    "(UNDER DEVELOPMENT) Upload multiple annotations to this project",
});
