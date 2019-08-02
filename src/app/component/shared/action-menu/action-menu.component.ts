import { Component, OnInit } from "@angular/core";
import {
  LabelAndIcon,
  ActionItem
} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";

@Component({
  selector: "app-action-menu",
  templateUrl: "./action-menu.component.html",
  styleUrls: ["./action-menu.component.scss"]
})
export class ActionMenuComponent implements OnInit {
  actionTitle: LabelAndIcon;
  actionLinks: List<ActionItem>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((val: PageInfo) => {
      const actionMenu = val.menus.actions;

      if (actionMenu) {
        this.actionTitle = val.category;
        this.actionLinks = actionMenu;
      }
    });
  }
}
