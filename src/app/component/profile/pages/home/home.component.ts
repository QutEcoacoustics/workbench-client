import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { MenusService } from './menus.service';
import {
  SecondaryLink,
  ActionTitle,
  ActionLink
} from 'src/app/services/layout-menus/layout-menus.service';

@Component({
  selector: 'app-profile-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProfileComponent implements OnInit {
  stats: List<{
    stat: string;
    value: number;
    icon: { style: string; name: string };
  }>;
  tags: List<{ tag: string; link: string; value: number }>;
  secondaryLinks: SecondaryLink[];
  actionTitle: ActionTitle;
  actionLinks: ActionLink[];

  constructor(private menus: MenusService) {}

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

    this.secondaryLinks = this.menus.secondaryMenu();
    this.actionTitle = this.menus.actionTitle();
    this.actionLinks = this.menus.actionLinks();
  }
}
