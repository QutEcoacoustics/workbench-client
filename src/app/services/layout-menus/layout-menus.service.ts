import { Injectable, Inject } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';
import { menus, ActionTitle, Link, Menus } from './menus';

/**
 * Manages the creation of links for the Secondary and Action menus
 * in the page layout. Each component which utilises <app-layout> will
 * use this class to generate the menus.
 */
@Injectable({
  providedIn: 'root'
})
export class LayoutMenusService {
  constructor(
    private _api: BawApiService,
    @Inject('MENU') private _menus?: Menus
  ) {}

  /**
   * Returns the secondary menu links
   * @returns List of secondary links
   */
  secondaryMenu(): Link[] {
    const loggedIn = this._api.loggedIn;

    // Combine links if required
    let links: Link[] = menus.secondary.links;
    if (this._menus && this._menus.secondary) {
      links = { ...links, ...this._menus.secondary.links };
    }

    // Loop through links and return all that pass their predicate function
    return links.filter(link => {
      // If link has a function, check it passes
      if (link.predicate !== undefined) {
        return link.predicate(loggedIn);
      }
      return true;
    });
  }

  /**
   * Returns the action title
   * @returns Action title and icon
   */
  actionTitle(): ActionTitle {
    return this._menus && this._menus.action.title
      ? this._menus.action.title
      : menus.action.title;
  }

  /**
   * Returns the action menu links
   * @returns List of action links
   */
  actionLinks(): Link[] {
    return this._menus && this._menus.action
      ? this._menus.action.links
      : menus.action.links;
  }
}
