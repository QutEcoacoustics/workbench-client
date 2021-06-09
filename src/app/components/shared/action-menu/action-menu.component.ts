import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AnyMenuItem, LabelAndIcon } from "@interfaces/menusInterfaces";
import { MenuModal, WidgetMenuItem } from "@menu/widgetItem";
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
      menuType="action"
      [title]="title"
      [links]="links"
      [widgets]="widgets"
    ></baw-menu>
  `,
})
export class ActionMenuComponent extends withUnsubscribe() implements OnInit {
  public title: LabelAndIcon;
  public links: List<AnyMenuItem | MenuModal>;
  public widgets: List<WidgetMenuItem>;
  private defaultCategory = defaultMenu.defaultCategory;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        this.title = page.category ?? this.defaultCategory;
        this.links = page.menus?.actions ?? List();
        this.widgets = page.menus?.actionWidgets ?? null;
      },
      (err: ApiErrorDetails) => console.error("ActionMenuComponent", err)
    );
  }
}
