import { Injectable } from '@angular/core';

import { settings } from '../../settings/app-settings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  constructor() {
    console.debug(settings);
  }
}
