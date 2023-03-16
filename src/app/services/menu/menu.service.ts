import { Inject, Injectable, Injector } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { homeMenuItem } from "@components/home/home.menus";
import {
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { DEFAULT_MENU, IDefaultMenu } from "@helpers/page/defaultMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  AnyMenuItem,
  LabelAndIcon,
  MenuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { User } from "@models/User";
import { ConfigService } from "@services/config/config.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { OrderedSet } from "immutable";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";

export interface MenuServiceData {
  hasActions: boolean;
  isFullscreen: boolean;
  isMenuOpen: boolean;
  breadcrumbs: BreadcrumbsData;
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

export interface Breadcrumb {
  label: string;
  icon: IconProp;
  route: StrongRoute;
}
export type BreadcrumbsData = OrderedSet<Breadcrumb>;

// TODO Make outputs observables, and expose a snapshot of the current state. Similar to activated route
@Injectable()
export class MenuService extends withUnsubscribe() {
  private _actionMenu: ActionMenuData;
  private _breadcrumbs: BreadcrumbsData;
  private _hasActions: boolean;
  private _isFullscreen: boolean;
  private _isMenuOpen: boolean;
  private _menuUpdate: BehaviorSubject<MenuServiceData>;
  private _pageInfo: IPageInfo;
  private _secondaryMenu: SecondaryMenuData;
  private _user: User;

  public constructor(
    private session: BawSessionService,
    private sharedRoute: SharedActivatedRouteService,
    @Inject(DEFAULT_MENU) private defaultMenu: IDefaultMenu,
    private injector: Injector,
    private config: ConfigService
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
      this._breadcrumbs = this.getBreadcrumbsData();
      this._actionMenu = this.getActionMenuData();
      this._secondaryMenu = this.getSecondaryMenuData();
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

  /** Returns current breadcrumb data */
  public get breadcrumbs(): BreadcrumbsData {
    return this._breadcrumbs;
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
   * Constructs a success callback that has knowledge of the current page component instance
   * This is used in the `menuModal` menu widget as it allows the menu item to interact with the current view component
   *
   * @returns A callback function that takes a page component instance as the first argument
   */
  public constructSuccessCallback(callback: (instance: PageComponent) => void): (instance: PageComponent) => void {
    return () => callback(this.sharedRoute.pageComponentInstance);
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

  private getBreadcrumbsData(): BreadcrumbsData {
    if (this.pageInfo.pageRoute === homeMenuItem) {
      return OrderedSet();
    }

    return this.rootToMenuRoute(this.pageInfo.pageRoute).map(
      (breadcrumb): Breadcrumb => ({
        label:
          breadcrumb.breadcrumbResolve?.(this.pageInfo, this.injector) ??
          breadcrumb.label,
        icon: breadcrumb.icon,
        route: breadcrumb.route,
      })
    );
  }

  private getActionMenuData(): ActionMenuData {
    const links =
      this.pageInfo.menus?.actions
        ?.filter(this.filterByPredicate)
        ?.sort(this.sortByOrderAndIndentation)
        ?.toOrderedSet() ?? OrderedSet();
    const widgets =
      this.pageInfo.menus?.actionWidgets
        ?.filter(this.filterByPredicate)
        ?.toOrderedSet() ?? OrderedSet();

    return {
      title: this.pageInfo.category ?? this.defaultMenu.defaultCategory,
      links,
      widgets,
    };
  }

  private getSecondaryMenuData(): SecondaryMenuData {
    // Get current page and all parents
    const parentMenuRoutes = this.rootToMenuRoute(this.pageInfo.pageRoute).map(
      (menuRoute) => menuRoute
    );

    const widgets =
      this.pageInfo.menus?.linkWidgets
        ?.filter(this.filterByPredicate)
        ?.toOrderedSet() ?? OrderedSet();

    // Combine current route ancestry with default menu
    const links = this.defaultMenu.contextLinks
      .concat(this.pageInfo.menus?.links ?? OrderedSet<NavigableMenuItem>())
      .filter(this.filterByPredicate)
      // Add parent menu routes after predicate so they are not filtered out
      .concat(parentMenuRoutes)
      .sort(this.sortByOrderAndIndentation);

    return { links, widgets };
  }

  private rootToMenuRoute(menuRoute: MenuRoute): OrderedSet<MenuRoute> {
    const hideProjects = this.config.settings.hideProjects;
    let menuRoutes = OrderedSet<MenuRoute>([menuRoute]);
    let current: MenuRoute = menuRoute;

    while (current.parent) {
      current = current.parent;

      /*
       * Substitute project menu items, if the hideProjects setting is enabled,
       * to the shallow regions route. This also happens to have no parent
       * route and will stop the route traversal
       */
      if (
        hideProjects &&
        [projectMenuItem, projectsMenuItem].includes(current)
      ) {
        current = shallowRegionsMenuItem;
      }

      menuRoutes = menuRoutes.add(current);
    }

    return menuRoutes.reverse();
  }

  private filterByPredicate = <
    T extends AnyMenuItem | WidgetMenuItem | MenuModalWithoutAction
  >(
    link: T
  ): boolean => {
    if (!link) {
      return false;
    }
    return link.predicate?.(this._user, this.pageInfo) ?? true;
  };

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
      breadcrumbs: this.breadcrumbs,
      secondaryMenu: this.secondaryMenu,
      actionMenu: this.actionMenu,
      pageInfo: this.pageInfo,
    };
  }
}
