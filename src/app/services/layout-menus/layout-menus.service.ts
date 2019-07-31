import { Injectable } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';
import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';
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

  getSecondaryLinks(
    additionalLinks?: List<LinkInterface>
  ): List<LinkInterface> {
    if (additionalLinks) {
      return secondaryLinks.push(...additionalLinks);
    }

    return secondaryLinks;
  }
}
