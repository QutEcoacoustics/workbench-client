import { Category } from "src/app/interfaces/layout-menus.interfaces";
import { MakeRoute } from "src/app/interfaces/Routing";

export const securityCategory: Category = {
  icon: ["fas", "user"],
  label: "Accounts",
  route: MakeRoute("security")
};
