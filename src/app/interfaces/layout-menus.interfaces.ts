import { Data, Route } from "@angular/router";
import { List } from "immutable";

/**
 * Part of an internal angular route
 */
export type RouteFragment = string;

/**
 * External URL
 */
export type Href = string;

/**
 * Fontawesome icon. Eg. ['fas', 'home']. All icons used must be imported in app.module.ts.
 */
export type Icon = [string, string] | readonly [string, string];

/**
 * A user model.
 */
export interface User {
  username: string;
  id: number;
  role: "Admin" | "User";
}

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
  route: Route;
}

export type MenuItemTypes = "MenuAction" | "MenuLink" | "MenuRoute";

export type UserCallback<T> = null | ((user?: User) => T);

/**
 * An item designed to be in a menu.
 * @extends LabelAndIcon
 */
export interface MenuItem extends LabelAndIcon {
  // kind: MenuItemTypes;
  /**
   * The tooltip that will be shown when context for this link is required.
   */
  tooltip: UserCallback<string>;
  /**
   * Whether or not to show this link.
   */
  predicate?: UserCallback<boolean>;
}

/**
 * MenuLink interface. Defines all the requirements of a link.
 * @extends MenuItem
 */
export interface MenuLink extends MenuItem {
  kind: "MenuLink";
  /**
   * The URL or fragment this link points to
   */
  uri: Href;
}

/**
 * MenuLink interface. Defines all the requirements of a link.
 * @extends MenuItem
 */
export interface MenuRoute extends MenuItem {
  kind: "MenuRoute";
  /**
   * The URL or fragment this link points to
   */
  route: Route;
}

/**
 * Action Link interface. Defines all the requirements of a link.
 * @extends MenuItem
 */
export interface MenuAction extends MenuItem {
  kind: "MenuAction";
  action: () => any | void;
}

export type AnyMenuItem = MenuAction | MenuLink | MenuRoute;
export type NavigableMenuItem = MenuLink | MenuRoute;

export function isButton(menuItem: AnyMenuItem): menuItem is MenuAction {
  return menuItem.kind === "MenuAction";
}
export function isAnchor(
  menuItem: AnyMenuItem
): menuItem is MenuLink | MenuRoute {
  return menuItem.kind === "MenuLink" || menuItem.kind === "MenuRoute";
}
export function isInternalRoute(menuItem: AnyMenuItem): menuItem is MenuRoute {
  return menuItem.kind === "MenuRoute";
}
export function isExternalLink(menuItem: AnyMenuItem): menuItem is MenuLink {
  return menuItem.kind === "MenuLink";
}

/**
 * MenusInfo interface. This stores information required to generate the
 * various menus attached to a component.
 * @param actions List of actions
 * @param links List of secondary links
 */
export interface Menus {
  actions: List<AnyMenuItem>;
  links: List<NavigableMenuItem>;
}

/**
 * Page info interface.
 * This stores information required to generate the various menus of the page.
 * Also stores metadata about the page, like the icon to use, and the route
 * for that page.
 */
export interface PageInfoInterface extends Data, MenuItem {
  routeFragment: RouteFragment;
  category: LabelAndIcon;
  menus: Menus;
}
