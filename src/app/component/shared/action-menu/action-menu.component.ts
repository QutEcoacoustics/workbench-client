import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { AnyMenuItem, LabelAndIcon } from "src/app/interfaces/menusInterfaces";
import { PageInfo } from "src/app/interfaces/pageInfo";
import { DefaultMenu } from "src/app/services/layout-menus/defaultMenus";
import { WidgetMenuItem } from "../widget/widgetItem";

@Component({
  selector: "app-action-menu",
  template: `
    <app-menu
      [title]="actionTitle"
      [links]="actionLinks"
      [widget]="actionWidget"
      [menuType]="'action'"
    >
    </app-menu>
  `
})
export class ActionMenuComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  actionTitle: LabelAndIcon;
  actionLinks: List<AnyMenuItem>;
  actionWidget: WidgetMenuItem;

  ngOnInit() {
    this.route.data.subscribe((page: PageInfo) => {
      const actionMenu =
        page && page.menus && page.menus.actions
          ? page.menus.actions
          : List<AnyMenuItem>();
      const actionWidget =
        page && page.menus && page.menus.actions
          ? page.menus.actionsWidget
          : null;

      this.actionTitle =
        page && page.category ? page.category : DefaultMenu.defaultCategory;
      this.actionLinks = actionMenu;
      this.actionWidget = actionWidget;
    });
  }
}
