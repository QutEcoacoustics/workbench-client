import { menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const pageNotFoundRoute = StrongRoute.newRoot().add("**");
export const pageNotFoundMenuItem = menuRoute({
  icon: ["fas", "exclamation-triangle"],
  label: "Page Not Found",
  route: pageNotFoundRoute,
  disabled: true,
  tooltip: () => "The requested page was not found",
});
