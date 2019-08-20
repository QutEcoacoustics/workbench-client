import { List } from "immutable";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import {
  loginMenuItem,
  registerMenuItem
} from "src/app/component/security/security.menus";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem
  ]),
  defaultCategory: homeCategory
};
