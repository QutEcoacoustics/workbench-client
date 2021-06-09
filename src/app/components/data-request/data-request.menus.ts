import { homeCategory } from "@components/home/home.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const dataRequestRoute = StrongRoute.newRoot().add("data_request");

export const dataRequestCategory: Category = homeCategory;

export const dataRequestMenuItem = menuRoute({
  icon: ["fas", "table"],
  label: "Data Request",
  route: dataRequestRoute,
  tooltip: () => "Request customized data from the website",
  order: 7,
});
