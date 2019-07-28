import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Link, ActionTitle } from 'src/app/services/layout-menus/menus';
import { MenusService } from './menus.service';

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataRequestComponent implements OnInit {
  secondaryLinks: Link[];
  actionLinks: Link[];
  actionTitle: ActionTitle;
  constructor(private menus: MenusService) {}

  ngOnInit() {
    this.secondaryLinks = this.menus.secondaryMenu();
    this.actionTitle = this.menus.actionTitle();
    this.actionLinks = this.menus.actionLinks();
  }
}
