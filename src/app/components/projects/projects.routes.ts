import { StrongRoute } from "@interfaces/strongRoute";

export const projectsRoute = StrongRoute.newRoot().add("projects");
export const projectRoute = projectsRoute.add(":projectId");
export const editProjectPermissionsRoute = projectRoute.add("permissions");
