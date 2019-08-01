import { Injectable, Inject, forwardRef } from "@angular/core";
import { BawApiService } from "../baw-api/baw-api.service";
import {
  MenuLink,
  User,
  MenuAction,
  ActionItems,
  Menus,
} from "src/app/interfaces/layout-menus.interfaces";

import { List } from "immutable";
import { DefaultMenu } from "./defaultMenus";
import { ActivatedRoute } from "@angular/router";

/**
 * Manages the creation of links for the Secondary and Action menus
 * in the page layout. Each component which utilizes <app-layout> will
 * use this class to generate the menus.
 */
@Injectable({
  providedIn: "root"
})
export class LayoutMenusService {
  private api;
  private defaultMenu;

  constructor(
    api: BawApiService,
    defaultMenu: DefaultMenu,
    route: ActivatedRoute) {
      this.api = api;
      this.defaultMenu = defaultMenu;
    }

  /**
   * Generates a list of links for the secondary menu
   */
  getSecondaryLinks(
    menus: Menus
  ): List<MenuLink> {
    // Get user details
    const user: User = {
      userName: this.api.user_name
    };

    // Get links
    let links = this.defaultMenu.secondaryLinks || List();
    if (menus && menus.links) {
      links = links.concat(menus.links);
    }

    // Filter and return
    return links.filter(link => this.filter(user, link));
  }

  /**
   * Generates a list of buttons / links for the action menu
   * @param menuOptions Action menu options
   */
  getActionMenu(menus: Menus): ActionItems {
    if (!menus || !menus.actions) {
      return null;
    }

    // Get user details
    const user: User = {
      userName: this.api.user_name
    };

    // Filter buttons/links
    const menuOptions = menus.actions.filter(link =>
      this.filter(user, link)
    );

    return menuOptions;
  }

  /**
   * Filters a list of links / buttons used by the action and secondary menus.
   * @param user User details
   * @param link Link to display
   */
  private filter(user: User, link: MenuLink | MenuAction) {
    // If link has predicate function, test if returns true
    if (link.predicate) {
      return link.predicate(user);
    }
    return true;
  }
}
