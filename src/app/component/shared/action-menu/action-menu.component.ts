import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo } from "src/app/helpers/page/pageInfo";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem, LabelAndIcon } from "src/app/interfaces/menusInterfaces";
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
export class ActionMenuComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}

  subsink = new SubSink();
  actionTitle: LabelAndIcon;
  actionLinks: List<AnyMenuItem>;
  actionWidget: WidgetMenuItem;

  ngOnInit() {
    this.subsink.sink = this.route.data.subscribe((page: PageInfo) => {
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

  ngOnDestroy() {
    this.subsink.unsubscribe();
  }
}
