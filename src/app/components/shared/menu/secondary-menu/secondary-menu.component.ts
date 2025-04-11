import { Component, Input, OnInit } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { NavigableMenuItem } from "@interfaces/menusInterfaces";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { MenuService } from "@services/menu/menu.service";
import { Set } from "immutable";
import { takeUntil } from "rxjs";
import { MenuComponent } from "../menu/menu.component";

/**
 * Secondary Menu Component.
 * A menu located close to the subject of the page, displaying easy access
 * links. It also acts as a breadcrumb showing the user their current location.
 */
@Component({
  selector: "baw-secondary-menu",
  template: ` <baw-menu menuType="secondary" [links]="links" [widgets]="widgets" [isSideNav]="isSideNav"></baw-menu> `,
  imports: [MenuComponent],
})
export class SecondaryMenuComponent extends withUnsubscribe() implements OnInit {
  @Input() public isSideNav: boolean;

  public links: Set<NavigableMenuItem | MenuModalWithoutAction>;
  public widgets: Set<WidgetMenuItem>;

  public constructor(private menu: MenuService) {
    super();
  }

  public ngOnInit(): void {
    this.menu.menuUpdate.pipe(takeUntil(this.unsubscribe)).subscribe(({ secondaryMenu }): void => {
      this.links = secondaryMenu.links;
      this.widgets = secondaryMenu.widgets;
    });
  }
}
