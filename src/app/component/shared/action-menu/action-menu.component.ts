import { Component, OnInit } from '@angular/core';
import {
  NameAndIcon,
  ActionInterface
} from 'src/app/interfaces/layout-menus.interfaces';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  actionTitle: NameAndIcon;
  actionLinks: ActionInterface[];

  constructor() {}

  ngOnInit() {}
}
