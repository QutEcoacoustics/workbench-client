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
  selector: 'app-about-disclaimers',
  templateUrl: './disclaimers.component.html',
  styleUrls: ['./disclaimers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutDisclaimersComponent
  implements OnInit, HeaderItem, LayoutMenus {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'exclamation-circle'],
      label: 'Disclaimers',
      uri: new Route('/about/disclaimers')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
}
