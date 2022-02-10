import { homeCategory } from "@components/home/home.menus";
import { OrderedSet } from "immutable";
import { IDefaultMenu } from "./defaultMenus";

export const mockDefaultMenu: IDefaultMenu = {
  contextLinks: OrderedSet([]),
  defaultCategory: homeCategory,
};
