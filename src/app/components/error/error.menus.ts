import { menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

// Match all unknown routes
export const pageNotFoundRoute = StrongRoute.newRoot().add("**");
export const pageNotFoundMenuItem = menuRoute({
  icon: ["fas", "exclamation-triangle"],
  label: "Page Not Found",
  route: pageNotFoundRoute,
  disabled: true,
  /*
   * Show link is active regardless of current route. Page not found
   * applies to any unknown route so its route will not match the
   * current route
   */
  highlight: true,
  tooltip: () => "The requested page was not found",
});
