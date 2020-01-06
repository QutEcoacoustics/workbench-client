import {
  Category,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const projectsRoute = StrongRoute.Base.add("projects");

export const projectsCategory: Category = {
  icon: ["fas", "globe-asia"],
  label: "Projects",
  route: projectsRoute
};

export const projectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "Projects",
  route: projectsRoute,
  tooltip: () => "View projects I have access too",
  order: { priority: 4, indentation: 0 }
});

export const newProjectMenuItem = MenuRoute({
  icon: ["fas", "plus"],
  label: "New project",
  route: projectsRoute.add("new"),
  tooltip: () => "Create a new project",
  predicate: user => !!user,
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const requestProjectMenuItem = MenuRoute({
  icon: ["fas", "key"],
  label: "Request access",
  route: projectsRoute.add("request"),
  tooltip: () => "Request access to a project not listed here",
  predicate: user => !!user,
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const projectMenuItem = MenuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  route: projectsRoute.add(":projectId"),
  tooltip: () => "The current project",
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const projectCategory: Category = {
  icon: projectsCategory.icon,
  label: "Project",
  route: projectMenuItem.route
};

export const editProjectMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit this project",
  route: projectMenuItem.route.add("edit"),
  parent: projectMenuItem,
  tooltip: () => "Change the details for this project",
  predicate: user => !!user,
  order: {
    priority: projectMenuItem.order.priority,
    indentation: projectMenuItem.order.indentation + 1
  }
});

export const exploreAudioMenuItem = MenuLink({
  uri: "/listen",
  icon: ["fas", "map"],
  label: "Explore audio",
  tooltip: () => "Explore audio"
});

export const editProjectPermissionsMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "key"],
  label: "Edit Permissions",
  tooltip: () => "REPLACE_ME",
  predicate: user => !!user
});
