import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AnyMenuItem, LabelAndIcon } from "@interfaces/menusInterfaces";
import { WidgetMenuItem } from "@menu/widgetItem";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

/**
 * Action Menu Component.
 * A menu on the right side of the page displaying actions available
 * to the user.
 */
@Component({
  selector: "baw-action-menu",
  template: `
    <baw-menu
      [title]="actionTitle"
      [links]="actionLinks"
      [widget]="actionWidget"
      [menuType]="'action'"
    ></baw-menu>
  `,
})
export class ActionMenuComponent extends withUnsubscribe() implements OnInit {
  public actionTitle: LabelAndIcon;
  public actionLinks: List<AnyMenuItem>;
  public actionWidget: WidgetMenuItem;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        this.actionTitle = page?.category ?? defaultMenu.defaultCategory;
        this.actionLinks = page?.menus?.actions ?? List();
        this.actionWidget = page?.menus?.actionsWidget ?? null;
      },
      (err: ApiErrorDetails) => console.error("ActionMenuComponent", err)
    );
  }
}
