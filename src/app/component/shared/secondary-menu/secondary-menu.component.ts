import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LinkInterface,
  PageInfo
} from 'src/app/interfaces/layout-menus.interfaces';
import { LayoutMenusService } from 'src/app/services/layout-menus/layout-menus.service';

@Component({
  selector: 'app-secondary-menu',
  templateUrl: './secondary-menu.component.html',
  styleUrls: ['./secondary-menu.component.scss']
})
export class SecondaryMenuComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _layout: LayoutMenusService
  ) {}

  secondaryLinks: LinkInterface[] = this._layout.getSecondaryLinks();

  ngOnInit() {
    console.debug('Secondary Menu Component');
    console.debug(this.secondaryLinks);
    console.debug(this._route);
    this._route.data.subscribe((val: PageInfo) => {
      console.debug(val);
    });
  }
}
