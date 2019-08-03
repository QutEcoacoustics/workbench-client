import { NavigableMenuItem } from "src/app/interfaces/layout-menus.interfaces";
import { LoginComponent } from "src/app/component/authentication/pages/login/login.component";
import { RegisterComponent } from "src/app/component/authentication/pages/register/register.component";
import { List } from "immutable";
import {
  homeCategory,
  HomeComponent
} from "src/app/component/home/home.component";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    HomeComponent.pageInfo,
    LoginComponent.pageInfo,
    RegisterComponent.pageInfo
  ]),
  defaultCategory: homeCategory
};
