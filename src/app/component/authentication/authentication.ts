import { Category } from "src/app/interfaces/layout-menus.interfaces";
import { StrongRoute } from "src/app/interfaces/Routing";

export const securityRoute = StrongRoute.Base.add("security");

export const securityCategory: Category = {
  icon: ["fas", "user"],
  label: "Accounts",
  route: securityRoute
};
