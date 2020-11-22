import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const homeRoute = StrongRoute.Base.add("");
export const homeCategory: Category = {
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute,
};
export const homeMenuItem = MenuRoute({
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute,
  tooltip: () => "Home page",
  order: 1,
});
