import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MenusService } from './menus.service';
import {
  SecondaryLink,
  ActionTitle,
  ActionLink
} from 'src/app/services/layout-menus/layout-menus.service';

@Component({
  selector: 'app-about-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutCreditsComponent implements OnInit {
  secondaryLinks: SecondaryLink[];
  actionTitle: ActionTitle;
  actionLinks: ActionLink[];

  constructor(private menus: MenusService) {}

  ngOnInit() {
    this.secondaryLinks = this.menus.secondaryMenu();
    this.actionTitle = this.menus.actionTitle();
    this.actionLinks = this.menus.actionLinks();
  }
}
