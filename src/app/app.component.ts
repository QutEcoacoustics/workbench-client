import { Component } from '@angular/core';
import { BawApiService } from './services/baw-api/baw-api.service';
import { LayoutMenusService } from './services/layout-menus/layout-menus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuLayout: boolean;

  constructor(private _menus: LayoutMenusService) {
    this.menuLayout = false;
  }
}
