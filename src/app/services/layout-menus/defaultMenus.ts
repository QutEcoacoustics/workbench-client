import { NavigableMenuItem, LabelAndIcon, MenuRoute } from "src/app/interfaces/layout-menus.interfaces";
import { LoginComponent } from "src/app/component/authentication/pages/login/login.component";
import { RegisterComponent } from "src/app/component/authentication/pages/register/register.component";
import { List } from "immutable";


export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    // TODO: reference this from the home module
    {
      kind: "MenuRoute",
      label: "Home",
      icon: ["fas", "home"],
      tooltip: () => "Home page",
      route: "/"
    } as MenuRoute,
    LoginComponent.pageInfo,
    RegisterComponent.pageInfo
  ]),
  // TODO: reference this from the home module
  defaultCategory: {
    label: "Home",
    icon: ["fas", "home"]
  } as LabelAndIcon
};
