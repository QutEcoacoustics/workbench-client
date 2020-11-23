import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const homeRoute = StrongRoute.base.add("");
export const homeCategory: Category = {
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute,
};
export const homeMenuItem = menuRoute({
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute,
  tooltip: () => "Home page",
  order: 1,
});
