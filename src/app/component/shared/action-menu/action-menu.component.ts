import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo } from "src/app/helpers/page/pageInfo";
import { AnyMenuItem, LabelAndIcon } from "src/app/interfaces/menusInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
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
  private unsubscribe = new Subject();
  actionTitle: LabelAndIcon;
  actionLinks: List<AnyMenuItem>;
  actionWidget: WidgetMenuItem;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
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
      },
      (err: ApiErrorDetails) => console.error("ActionMenuComponent", err)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
