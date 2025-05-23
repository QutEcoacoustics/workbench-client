import { isLoggedInGuard } from "@guards/security/is-logged-in/is-logged-in.guard";
import { StrongRoute } from "@interfaces/strongRoute";

export const projectsRoute = StrongRoute.newRoot().add("projects", undefined, {
  canActivate: [isLoggedInGuard],
});
export const projectRoute = projectsRoute.add(":projectId");
export const editProjectPermissionsRoute = projectRoute.add("permissions");
