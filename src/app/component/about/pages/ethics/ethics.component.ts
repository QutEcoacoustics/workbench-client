import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  LayoutMenus,
  Route,
  LayoutMenusInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';

@Component({
  selector: 'app-about-ethics',
  templateUrl: './ethics.component.html',
  styleUrls: ['./ethics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutEthicsComponent implements OnInit, LayoutMenus, HeaderItem {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'balance-scale'],
      label: 'Ethics',
      uri: new Route('/about/ethics')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
}
