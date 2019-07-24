import { Injectable } from '@angular/core';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';

import { secondary, action } from './menus.json';
import { LayoutMenusService } from 'src/app/services/layout-menus/layout-menus.service.js';

@Injectable({
  providedIn: 'root'
})
export class MenusService extends LayoutMenusService {
  constructor(private api: BawApiService) {
    super(api, secondary, action);
  }
}
