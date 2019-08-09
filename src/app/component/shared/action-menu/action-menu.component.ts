import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import {
  AnyMenuItem,
  LabelAndIcon
} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/page.decorator";
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
    this.route.data.subscribe((val: PageInfo) => {
      const actionMenu =
        val && val.menus && val.menus.actions
          ? val.menus.actions
          : List<AnyMenuItem>();

      this.actionTitle =
        val && val.category ? val.category : DefaultMenu.defaultCategory;
      this.actionLinks = actionMenu;
    });
  }
}
