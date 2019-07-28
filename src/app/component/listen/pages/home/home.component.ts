import { Component, OnInit } from '@angular/core';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';
import { Href } from 'src/app/services/layout-menus/layout-menus.interface';

@Component({
  selector: 'app-listen',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ListenComponent implements OnInit, HeaderItem {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'headphones'],
      label: 'Report Problem',
      uri: new Href('https://www.ecosounds.org/listen')
    });
  }
}
