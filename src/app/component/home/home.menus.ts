import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const homeRoute = StrongRoute.Base.add("home", { redirectTo: "" });
export const homeCategory: Category = {
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute
};
export const homeMenuItem = MenuRoute({
  icon: ["fas", "home"],
  label: "Home",
  route: homeRoute,
  tooltip: () => "Home page",
  predicate: user => !user,
  order: { priority: 1, indentation: 0 }
});
