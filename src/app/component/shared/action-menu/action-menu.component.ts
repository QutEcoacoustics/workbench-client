import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import {
  AnyMenuItem,
  LabelAndIcon
} from "src/app/interfaces/menus.interfaces";
import { PageInfo } from "src/app/interfaces/pageInfo";
import { DefaultMenu } from "src/app/services/layout-menus/defaultMenus";

@Component({
  selector: "app-action-menu",
  templateUrl: "./action-menu.component.html",
  styleUrls: ["./action-menu.component.scss"]
})
export class ActionMenuComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  actionTitle: LabelAndIcon;
  actionLinks: List<AnyMenuItem>;

  ngOnInit() {
    this.route.data.subscribe((page: PageInfo) => {
      const actionMenu =
        page && page.menus && page.menus.actions
          ? page.menus.actions
          : List<AnyMenuItem>();

      this.actionTitle =
        page && page.category ? page.category : DefaultMenu.defaultCategory;
      this.actionLinks = actionMenu;
    });
  }
}
