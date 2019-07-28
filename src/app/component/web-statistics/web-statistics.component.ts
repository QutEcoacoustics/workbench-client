import { Component, OnInit } from '@angular/core';
import {
  LayoutMenusInterface,
  SecondaryLinkInterface,
  Href
} from 'src/app/services/layout-menus/layout-menus.interface';

@Component({
  selector: 'app-web-statistics',
  templateUrl: './web-statistics.component.html',
  styleUrls: ['./web-statistics.component.scss']
})
export class WebStatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    window.location.href = 'https://www.ecosounds.org/website_status';
  }

  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'chart-line'],
      label: 'Statistics',
      uri: new Href('https://www.ecosounds.org/website_status'),
      tooltip: 'Annotation and audio recording stats'
    });
  }
}
