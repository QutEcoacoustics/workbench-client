import { Injectable } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Manages the creation of links for the Secondary and Action menus
 * in the page layout. Each component which utilises <app-layout> will
 * use this class to generate the menus.
 */
@Injectable({
  providedIn: 'root'
})
export class LayoutMenusService {
  constructor(private _api: BawApiService, private _router: ActivatedRoute) {}

  /**
   * Returns true if page should utilise a layout containing secondary and action menus
   */
  isMenuLayout() {
    if (typeof this._router.component === 'string') {
      return false;
    }

    return !!this._router.component.prototype.getMenu;
  }
}
