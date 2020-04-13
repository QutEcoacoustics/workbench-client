import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { homeCategory } from "../home/home.menus";

export const dataRequestRoute = StrongRoute.Base.add("data_request");

export const dataRequestCategory: Category = homeCategory;

export const dataRequestMenuItem = MenuRoute({
  icon: ["fas", "table"],
  label: "Data Request",
  route: dataRequestRoute,
  tooltip: () => "Request customized data from the website",
  order: 7
});
