import { Injectable } from '@angular/core';

import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { LayoutMenusService } from 'src/app/services/layout-menus/layout-menus.service.js';

import { menus } from './home.component.menus';

@Injectable({
  providedIn: 'root'
})
export class MenusService extends LayoutMenusService {
  constructor(private api: BawApiService) {
    super(api, menus);
  }
}
