import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import {
  SecondaryLink,
  LayoutMenus,
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';
import { menus } from './home.component.menus';

@Component({
  selector: 'app-profile-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProfileComponent
  implements OnInit, SecondaryLink, HeaderItem, LayoutMenus {
  stats: List<{
    stat: string;
    value: number;
    icon: { style: string; name: string };
  }>;
  tags: List<{ tag: string; link: string; value: number }>;

  constructor() {}

  ngOnInit() {
    this.stats = List([
      { stat: 'Projects', value: 8, icon: { style: 'fas', name: 'home' } },
      { stat: 'Tags', value: 0, icon: { style: 'fas', name: 'tags' } },
      { stat: 'Bookmarks', value: 1, icon: { style: 'fas', name: 'bookmark' } },
      {
        stat: 'Sites',
        value: 177,
        icon: { style: 'fas', name: 'map-marker-alt' }
      },
      {
        stat: 'Annotations',
        value: 2030,
        icon: { style: 'fas', name: 'bullseye' }
      },
      { stat: 'Comments', value: 2, icon: { style: 'fas', name: 'comments' } }
    ]);

    this.tags = List([
      {
        tag: 'Xueyan-FELT',
        link:
          'https://staging.ecosounds.org/library?reference=all&tagsPartial=Xueyan-FELT',
        value: 1939
      },
      {
        tag: 'Training Dataset',
        link:
          'https://staging.ecosounds.org/library?reference=all&tagsPartial=Training%20Dataset',
        value: 983
      },
      {
        tag: 'Test Dataset',
        link:
          'https://staging.ecosounds.org/library?reference=all&tagsPartial=Test%20Dataset',
        value: 960
      }
    ]);
  }

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'user'],
      label: 'My Profile',
      uri: new Route('/profile')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return menus;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'user'],
      label: 'My Profile',
      uri: new Route('/profile'),
      tooltip: 'View profile',
      predicate: loggedin => loggedin
    });
  }
}
