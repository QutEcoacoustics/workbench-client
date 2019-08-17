import { List } from "immutable";

import { loginMenuItem, registerMenuItem } from "src/app/component/authentication/authentication.menus";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import { NavigableMenuItem } from "src/app/interfaces/menus.interfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem
  ]),
  defaultCategory: homeCategory
};
