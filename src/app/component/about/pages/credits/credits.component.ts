import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  LayoutMenus,
  LayoutMenusInterface,
  Route
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';

@Component({
  selector: 'app-about-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutCreditsComponent implements OnInit, LayoutMenus, HeaderItem {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'hands-helping'],
      label: 'Credits',
      uri: new Route('/about/credits')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
}
