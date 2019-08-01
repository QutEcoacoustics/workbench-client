import { Component, OnInit } from '@angular/core';
import {
  NameAndIcon,
  ActionInterface,
  PageInfo,
  ActionMenuInterface,
  InternalRoute,
  Href
} from 'src/app/interfaces/layout-menus.interfaces';
import { ActivatedRoute } from '@angular/router';
import { LayoutMenusService } from 'src/app/services/layout-menus/layout-menus.service';
import { List } from 'immutable';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  actionTitle: NameAndIcon;
  actionLinks: List<ActionInterface>;

  constructor(
    private _route: ActivatedRoute,
    private _layout: LayoutMenusService
  ) {}

  ngOnInit() {
    console.debug('Action Menu Component');
    this._route.data.subscribe((val: PageInfo) => {
      console.debug(val);
      const actionMenu: ActionMenuInterface = this._layout.getActionMenu(
        val.menus.actions
      );

      if (actionMenu) {
        console.log('Action menu links found');
        console.log(actionMenu);

        this.actionTitle = actionMenu.list_title;
        this.actionLinks = actionMenu.links;
      }
    });
  }

  isInternalLink(
    action: Function | InternalRoute | Href
  ): action is InternalRoute {
    return typeof action === 'string' && action.substr(0, 1) === '/';
  }

  isExternalLink(action: Function | InternalRoute | Href): action is Href {
    return typeof action === 'string' && action.substr(0, 1) !== '/';
  }

  isButton(action: Function | InternalRoute | Href): action is Function {
    return typeof action === 'function';
  }
}
