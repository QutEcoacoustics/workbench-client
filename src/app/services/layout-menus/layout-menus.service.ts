import { Injectable } from '@angular/core';
import { BawApiService } from '../baw-api/baw-api.service';
import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';
import { secondaryLinks } from './default-menus';

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

  getSecondaryLinks(): LinkInterface[] {
    console.debug(secondaryLinks);
    return secondaryLinks;
  }
}
