import { List } from "immutable";
import { LoginComponent } from "src/app/component/authentication/pages/login/login.component";
import { RegisterComponent } from "src/app/component/authentication/pages/register/register.component";
import {
  homeCategory,
  HomeComponent
} from "src/app/component/home/home.component";
import { NavigableMenuItem } from "src/app/interfaces/layout-menus.interfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    HomeComponent.pageInfo,
    LoginComponent.pageInfo,
    RegisterComponent.pageInfo
  ]),
  defaultCategory: homeCategory
};
