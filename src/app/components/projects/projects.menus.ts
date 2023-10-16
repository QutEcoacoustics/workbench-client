import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Category, menuRoute, TitleOptionsHash } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import {
  defaultEditIcon,
  defaultNewIcon,
  defaultPermissionsIcon,
  isAdminPredicate,
  isLoggedInPredicate,
  isProjectEditorPredicate,
  isWorkInProgressPredicate,
} from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
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
  title: (_routerState: RouterStateSnapshot, titleOptions: TitleOptionsHash) =>
    titleOptions.hideProjects ? "Sites" : "Projects",
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
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel.project.model.name;
  },
});

export const editProjectMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this project",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: projectMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this project",
  title: () => CommonRouteTitles.routeEditTitle,
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

export const uploadAnnotationsProjectMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Batch Upload Annotations",
  parent: projectMenuItem,
  // TODO: Once functionality is implemented, this should be changed to isProjectWriterPredicate
  predicate: isWorkInProgressPredicate,
  route: projectMenuItem.route.add("batch-annotations"),
  tooltip: () =>
    "(UNDER DEVELOPMENT) Upload multiple annotations to this project",
});
