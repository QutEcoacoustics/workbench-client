import { Params } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { List } from "immutable";
import { WidgetMenuItem } from "../component/shared/widget/widgetItem";
import { SessionUser } from "../models/User";
import { StrongRoute } from "./strongRoute";

/**
 * Part of an (a single file/directory) internal angular route
 */
export type RouteFragment = string;

/**
 * External URL
 */
export type Href = string;

/**
 * Fontawesome icon. Eg. ['fas', 'home']. All icons used must be imported in app.module.ts.
 */
export type Icon = IconProp;

/**
 * Component Name and Icon
 */
export interface LabelAndIcon {
  /**
   * The icon to show for this resource
   */
  icon: Icon;
  /**
   * The label to show for this resource
   */
  label: string;
}

/**
 * Category interface
 * @extends LabelAndIcon
 */
export interface Category extends LabelAndIcon {
  /**
   *  Local route of category Eg. 'security'
   */
  route: StrongRoute;
}

/**
 * Literal string choice type (like an enum) used for the `kind`
 * property in things derived from MenuItems.
 */
export type MenuItemKinds = "MenuAction" | "MenuLink" | "MenuRoute";

/**
 * User callback function
 */
export type UserCallback<T> = null | ((user?: SessionUser) => T);

/**
 * An item designed to be in a menu.
 * Do not use this directly, see the derived interfaces.
 * @extends LabelAndIcon
 */
export interface MenuItem extends LabelAndIcon {
  kind: MenuItemKinds;

  /**
   * The tooltip that will be shown when context for this link is required.
   */
  tooltip: UserCallback<string>;
  /**
   * Whether or not to show this link.
   */
  predicate?: UserCallback<boolean>;
  /**
   * The order position of this link in comparison to others.
   */
  order?: number;
  /**
   * The indentation of this link
   */
  indentation?: number;
}

/**
 * MenuLink interface. Defines all the requirements of a href that points
 * to an external location, but not an internal route or page.
 * e.g. https://google.com.
 * @extends MenuItem
 */
export interface MenuLink extends MenuItem {
  kind: "MenuLink";
  /**
   * The URL or fragment this link points to
   */
  uri: Href;
}

export function MenuLink<T extends Omit<MenuLink, "kind">>(item: T): MenuLink {
  return Object.assign(item, {
    kind: "MenuLink" as "MenuLink",
    indentation: 0
  });
}

/**
 * MenuRoute interface. Defines an internal page/route within this application.
 * Must be known to this angular app. e.g. /security/login
 * @extends MenuItem
 */
export interface MenuRoute extends MenuItem {
  kind: "MenuRoute";
  /**
   * The internal route this menu item points to
   */
  route: StrongRoute;

  /**
   * Menu parent
   */
  parent?: MenuRoute;
}

export function MenuRoute<T extends Omit<MenuRoute, "kind">>(
  item: T
): MenuRoute {
  return Object.assign(item, {
    kind: "MenuRoute" as "MenuRoute",
    indentation: item.parent ? item.parent.indentation + 1 : 0,
    order: item.parent ? item.parent.order : item.order
  });
}

/**
 * Action Link interface. Defines all the requirements of an non-navigable menu
 * item. A button.
 * @extends MenuItem
 */
export interface MenuAction extends MenuItem {
  kind: "MenuAction";
  action: () => any | void;
}

export function MenuAction<T extends Omit<MenuAction, "kind">>(
  item: T
): MenuAction {
  return Object.assign(item, {
    kind: "MenuAction" as "MenuAction",
    indentation: 0
  });
}

/**
 * Any Menu Item discriminated union. This is used to store any of the
 *  menu item types together in a collection.
 */
export type AnyMenuItem = MenuAction | MenuLink | MenuRoute;

/**
 * Any Menu Item  discriminated union. This is used to store any menu item,
 * that you can navigate to (i.e. not a button/action), together in a collection.
 */
export type NavigableMenuItem = MenuLink | MenuRoute;

/**
 * Determines if a menu item is a button (MenuAction)
 * @param menuItem Menu item
 */
export function isButton(menuItem: AnyMenuItem): menuItem is MenuAction {
  return menuItem.kind === "MenuAction";
}

/**
 * Determines if a menu item is part of the MenuItem interface
 * @param menuItem Menu item
 */
export function isInternalRoute(menuItem: AnyMenuItem): menuItem is MenuRoute {
  return menuItem.kind === "MenuRoute";
}

/**
 * Determines if a menu item is part of the MenuLink interface
 * @param menuItem Menu item
 */
export function isExternalLink(menuItem: AnyMenuItem): menuItem is MenuLink {
  return menuItem.kind === "MenuLink";
}

/**
 * Determines if an object is part of the Navigable interface
 * @param menuItem Menu item
 */
export function isNavigableMenuItem(
  menuItem: any
): menuItem is NavigableMenuItem {
  return isInternalRoute(menuItem) || isExternalLink(menuItem);
}

/**
 * MenusInfo interface. This stores information required to generate the
 * various menus attached to a component.
 * @param actions List of actions
 * @param links List of secondary links
 */
export interface Menus {
  actions: List<AnyMenuItem>;
  actionsWidget?: WidgetMenuItem;
  links: List<NavigableMenuItem>;
  linksWidget?: WidgetMenuItem;
}
