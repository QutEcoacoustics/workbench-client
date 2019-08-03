import {
  NavigableMenuItem,
  LabelAndIcon,
  MenuRoute
} from "src/app/interfaces/layout-menus.interfaces";
import { LoginComponent } from "src/app/component/authentication/pages/login/login.component";
import { RegisterComponent } from "src/app/component/authentication/pages/register/register.component";
import { List } from "immutable";
import { homeCategory } from "src/app/component/home/home.component";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    // TODO: reference this from the home module
    {
      kind: "MenuRoute",
      label: "Home",
      icon: ["fas", "home"],
      tooltip: () => "Home page",
      route: "/home",
      uri: "/home",
      order: 1
    } as MenuRoute,
    LoginComponent.pageInfo,
    RegisterComponent.pageInfo
  ]),
  // TODO: reference this from the home module
  defaultCategory: homeCategory
};
