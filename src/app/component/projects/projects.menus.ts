import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
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
  route: projectsRoute.add("all"),
  tooltip: () => "View projects I have access too",
  order: { priority: 4, indentation: 0 }
});

export const newProjectMenuItem = MenuRoute({
  icon: ["fas", "plus"],
  label: "New project",
  route: projectsRoute.add("new"),
  tooltip: () => "The current project",
  predicate: user => !!user,
  order: { priority: 4, indentation: 1 }
});

export const projectMenuItem = MenuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  route: projectsRoute.add(":projectId"),
  tooltip: () => "The current project",
  order: { priority: 4, indentation: 1 }
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
  tooltip: () => "The current project",
  predicate: user => !!user,
  order: { priority: 4, indentation: 2 }
});
