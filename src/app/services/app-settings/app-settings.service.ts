import { Injectable } from '@angular/core';
import settings from '../../settings/app-settings.json';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  constructor() {
    console.debug(settings as Settings);
  }
}

interface Settings {
  path: string;
  authenticated?: boolean;
  component?: string;
  dropdown: boolean;
  nav: string;
  title: string;
  production: boolean;
  routes?: Settings[];
}
