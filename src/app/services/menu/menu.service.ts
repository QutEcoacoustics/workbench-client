import { Inject, Injectable } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { DEFAULT_MENU, IDefaultMenu } from "@helpers/page/defaultMenus";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  AnyMenuItem,
  LabelAndIcon,
  MenuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { User } from "@models/User";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { OrderedSet } from "immutable";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";

export interface MenuServiceData {
  hasActions: boolean;
  isFullscreen: boolean;
  isMenuOpen: boolean;
  secondaryMenu: SecondaryMenuData;
  actionMenu: ActionMenuData;
  pageInfo: IPageInfo;
}

export interface ActionMenuData {
  title: LabelAndIcon;
  links: OrderedSet<AnyMenuItem | MenuModalWithoutAction>;
  widgets: OrderedSet<WidgetMenuItem>;
}

export interface SecondaryMenuData {
  links: OrderedSet<NavigableMenuItem | MenuModalWithoutAction>;
  widgets: OrderedSet<WidgetMenuItem>;
}

@Injectable()
export class MenuService extends withUnsubscribe() {
  private _actionMenu: ActionMenuData;
  private _hasActions: boolean;
  private _isFullscreen: boolean;
  private _isMenuOpen: boolean;
  private _menuUpdate: BehaviorSubject<MenuServiceData>;
  private _secondaryMenu: SecondaryMenuData;
  private _user: User;
  private _pageInfo: IPageInfo;

  public constructor(
    private session: BawSessionService,
    private sharedRoute: SharedActivatedRouteService,
    @Inject(DEFAULT_MENU) private defaultMenu: IDefaultMenu
  ) {
    super();

    const updateState = (): void => {
      // Sometimes triggered before pageInfo is known
      if (!this.pageInfo) {
        return;
      }
      const numActions = this.pageInfo.menus?.actions?.count() ?? 0;
      const numWidgets = this.pageInfo.menus?.actionWidgets?.count() ?? 0;
      this._hasActions = numActions + numWidgets > 0;
      this._actionMenu = this.getActionMenuData(this.pageInfo);
      this._secondaryMenu = this.getSecondaryMenuData(this.pageInfo);
      this._isFullscreen = !!this.pageInfo.fullscreen;
      this.triggerUpdate();
    };

    // Set initial state
    this._hasActions = false;
    this._isFullscreen = false;
    this._isMenuOpen = false;
    this._secondaryMenu = { links: OrderedSet(), widgets: OrderedSet() };
    this._actionMenu = {
      title: this.defaultMenu.defaultCategory,
      links: OrderedSet(),
      widgets: OrderedSet(),
    };

    this._menuUpdate = new BehaviorSubject(this.getData());

    /** Track the local user */
    this.session.authTrigger
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ user }): void => {
        this._user = user;
        updateState();
      });

    this.sharedRoute.pageInfo
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((page: IPageInfo): void => {
        // Close menu because of navigation, and update other state values
        this._isMenuOpen = false;
        this._pageInfo = page;
        updateState();
      });
  }

  /** Returns true if current page is fullscreen */
  public get isFullscreen(): boolean {
    return this._isFullscreen;
  }

  /** Returns true if the menu is currently open */
  public get isMenuOpen(): boolean {
    return this._isMenuOpen;
  }

  /** Returns true if current page has any actions */
  public get hasActions(): boolean {
    return this._hasActions;
  }

  /** Returns current action menu data */
  public get actionMenu(): ActionMenuData {
    return this._actionMenu;
  }

  /** Returns current secondary menu data */
  public get secondaryMenu(): SecondaryMenuData {
    return this._secondaryMenu;
  }

  /** Triggers whenever a change to the menu state occurs */
  public get menuUpdate(): Observable<MenuServiceData> {
    return this._menuUpdate;
  }

  /** Returns the latest pageInfo */
  public get pageInfo(): IPageInfo {
    return this._pageInfo;
  }

  /**
   * Toggle the state of the menu between open and close
   */
  public toggleMenu(): void {
    this._isMenuOpen = !this._isMenuOpen;
    this.triggerUpdate();
  }

  /**
   * Update the state of the menu to make it open
   */
  public openMenu(): void {
    this._isMenuOpen = true;
    this.triggerUpdate();
  }

  /**
   * Update the state of the menu to make it close
   */
  public closeMenu(): void {
    this._isMenuOpen = false;
    this.triggerUpdate();
  }

  /**
   * Trigger update event for dependent components
   */
  private triggerUpdate(): void {
    this._menuUpdate.next(this.getData());
  }

  private getActionMenuData(page: IPageInfo): ActionMenuData {
    const links =
      page.menus?.actions
        ?.filter((link) => this.filterByPredicate(link, page))
        ?.sort(this.sortByOrderAndIndentation)
        ?.toOrderedSet() ?? OrderedSet();
    const widgets = page.menus?.actionWidgets?.toOrderedSet() ?? OrderedSet();

    return {
      title: page.category ?? this.defaultMenu.defaultCategory,
      links,
      widgets,
    };
  }

  private getSecondaryMenuData(page: IPageInfo): SecondaryMenuData {
    // get current page
    const current = page.pageRoute;
    current.active = true; // Ignore predicate

    // and parent pages
    const parentMenuRoutes: MenuRoute[] = [];
    let menuRoute: MenuRoute = current;
    while (menuRoute.parent) {
      menuRoute = menuRoute.parent;
      menuRoute.active = true; // Ignore predicate
      parentMenuRoutes.push(menuRoute);
    }

    // and add it all together
    const widgets = page.menus?.linkWidgets?.toOrderedSet() ?? OrderedSet();
    const links = this.defaultMenu.contextLinks
      .concat<NavigableMenuItem | MenuModalWithoutAction>(
        page.menus?.links ?? OrderedSet(),
        OrderedSet(parentMenuRoutes).reverse(), // List lineage correctly
        OrderedSet([current])
      )
      .filter((link) => this.filterByPredicate(link, page))
      .sort(this.sortByOrderAndIndentation);

    // Save to state
    return { links, widgets };
  }

  private filterByPredicate<T extends AnyMenuItem | MenuModalWithoutAction>(
    link: T,
    page: IPageInfo
  ): boolean {
    if (!link) {
      return false;
    }

    if (!link.predicate || link.active) {
      // Clear any modifications to link by secondary menu. See getSecondaryMenuData
      link.active = false;
      return true;
    }
    return link.predicate(this._user, page);
  }

  /**
   * Sort function for list of menu items
   *
   * @param a First menu item
   * @param b Second menu item
   */
  private sortByOrderAndIndentation<
    T extends AnyMenuItem | MenuModalWithoutAction
  >(a: T, b: T): number {
    // If no order, return equal - i.e. a stable sort!
    if (!isInstantiated(a.order) && !isInstantiated(b.order)) {
      return 0;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order === b.order) {
      if (a.indentation === b.indentation) {
        return a.label.localeCompare(b.label);
      }

      return a.indentation < b.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return (a.order ?? Infinity) < (b.order ?? Infinity) ? -1 : 1;
  }

  /**
   * Returns the current state of the menus
   *
   * @returns State of menus
   */
  private getData(): MenuServiceData {
    return {
      hasActions: this.hasActions,
      isFullscreen: this.isFullscreen,
      isMenuOpen: this.isMenuOpen,
      secondaryMenu: this.secondaryMenu,
      actionMenu: this.actionMenu,
      pageInfo: this.pageInfo,
    };
  }
}
