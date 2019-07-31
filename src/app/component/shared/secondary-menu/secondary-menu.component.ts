import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';

@Component({
  selector: 'app-secondary-menu',
  templateUrl: './secondary-menu.component.html',
  styleUrls: ['./secondary-menu.component.scss']
})
export class SecondaryMenuComponent implements OnInit {
  secondaryLinks: LinkInterface[] = [];
  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    console.debug('Secondary Menu Component');
    console.debug(this._route);
    this._route.snapshot.firstChild.data.subscribe(val => {
      console.debug(val);
    });
  }
}
