import { Injectable } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';
import {
  LinkInterface,
  ActionMenuInterface,
  User,
  ActionInterface
} from 'src/app/interfaces/layout-menus.interfaces';
import { secondaryLinks } from './default-menus';
import { List } from 'immutable';

/**
 * Manages the creation of links for the Secondary and Action menus
 * in the page layout. Each component which utilises <app-layout> will
 * use this class to generate the menus.
 */
@Injectable({
  providedIn: 'root'
})
export class LayoutMenusService {
  constructor(private _api: BawApiService) {}

  /**
   * Generates a list of links for the secondary menu
   */
  getSecondaryLinks(
    additionalLinks?: List<LinkInterface>
  ): List<LinkInterface> {
    // Get user details
    const user: User = {
      loggedIn: this._api.loggedIn,
      user_name: this._api.user_name
    };

    // Get links
    const links = additionalLinks
      ? secondaryLinks.push(...additionalLinks)
      : secondaryLinks;

    // Filter and return
    return links.filter(link => this.filter(user, link));
  }

  /**
   * Generates a list of buttons / links for the action menu
   * @param menuOptions Action menu options
   */
  getActionMenu(menuOptions?: ActionMenuInterface): ActionMenuInterface {
    if (!menuOptions) {
      return null;
    }

    // Get user details
    const user: User = {
      loggedIn: this._api.loggedIn,
      user_name: this._api.user_name
    };

    // Filter buttons/links
    menuOptions.links = menuOptions.links.filter(link =>
      this.filter(user, link)
    );

    return menuOptions;
  }

  /**
   * Filters a list of links / buttons used by the action and secondary menus.
   * @param user User details
   * @param link Link to display
   */
  private filter(user: User, link: LinkInterface | ActionInterface) {
    // If link has predicate function, test if returns true
    if (link.predicate) {
      return link.predicate(user);
    }
    return true;
  }
}
