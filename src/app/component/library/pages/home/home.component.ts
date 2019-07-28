import { Component, OnInit } from '@angular/core';
import {
  SecondaryLink,
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';

@Component({
  selector: 'app-library',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class LibraryComponent implements OnInit, HeaderItem, SecondaryLink {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'book'],
      label: 'Library',
      uri: new Route('https://www.ecosounds.org/library')
    });
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'book'],
      label: 'Library',
      uri: new Route('https://www.ecosounds.org/library'),
      tooltip: 'Annotation library'
    });
  }
}
