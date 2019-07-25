import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  SecondaryLink,
  ActionTitle,
  ActionLink
} from 'src/app/services/layout-menus/layout-menus.service';
import { MenusService } from './menus.service';

@Component({
  selector: 'app-about-disclaimers',
  templateUrl: './disclaimers.component.html',
  styleUrls: ['./disclaimers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutDisclaimersComponent implements OnInit {
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

/**
 * Icon
 */
export const icon = ['fas', 'exclamation-circle'];
