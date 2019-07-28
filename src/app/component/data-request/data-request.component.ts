import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  SecondaryLink,
  Route,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from '../shared/header/header.interface';

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataRequestComponent implements OnInit, HeaderItem, SecondaryLink {
  constructor() {}

  ngOnInit() {}

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'table'],
      label: 'Data Request',
      uri: new Route('/data_request')
    });
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'table'],
      label: 'Data Request',
      uri: new Route('/data_request'),
      tooltip: 'Request customized data from the website'
    });
  }
}
