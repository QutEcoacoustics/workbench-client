import { Component, Input, OnInit, inject } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AnyMenuItem, LabelAndIcon } from "@interfaces/menusInterfaces";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { MenuService } from "@services/menu/menu.service";
import { Set } from "immutable";
import { takeUntil } from "rxjs";
import { MenuComponent } from "../menu/menu.component";

/**
 * Action Menu Component.
 * A menu located close to the current subject of the page, displaying relevant
 * actions available
 */
@Component({
  selector: "baw-action-menu",
  template: `
    <baw-menu
      menuType="action"
      [title]="title"
      [links]="links"
      [widgets]="widgets"
      [isSideNav]="isSideNav"
    ></baw-menu>
  `,
  imports: [MenuComponent],
})
export class ActionMenuComponent extends withUnsubscribe() implements OnInit {
  private readonly menu = inject(MenuService);

  @Input() public isSideNav: boolean;

  public title: LabelAndIcon;
  public links: Set<AnyMenuItem | MenuModalWithoutAction>;
  public widgets: Set<WidgetMenuItem>;

  public ngOnInit(): void {
    this.menu.menuUpdate
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ actionMenu }): void => {
        this.title = actionMenu.title;
        this.links = actionMenu.links;
        this.widgets = actionMenu.widgets;
      });
  }
}
