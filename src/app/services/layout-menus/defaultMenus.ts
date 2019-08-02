import { MenuLink } from "src/app/interfaces/layout-menus.interfaces";
// import { LoginComponent } from "src/app/component/authentication/pages/login/login.component";
// import { RegisterComponent } from "src/app/component/authentication/pages/register/register.component";
import { List } from "immutable";
import { GetPageInfo } from "src/app/interfaces/Page";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DefaultMenu {
  constructor() {}

  secondaryLinks: List<MenuLink> = List([
    // GetPageInfo(LoginComponent),
    // GetPageInfo(RegisterComponent)
  ]);
}
