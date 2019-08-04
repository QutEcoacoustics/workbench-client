import { Data, Route } from "@angular/router";
import { List } from "immutable";

/**
 * Part of an (a single file/directory) internal angular route
 */
export type RouteFragment = string;

/**
 * An angular style route string
 */
export type InternalRoute = string;

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
  route: InternalRoute;
}

/**
 * Defines order and indentation for `MenuItems`
 */
export interface Order {
  /**
   * Priority of link
   * The lower the value, the greater the importance.
   */
  priority: number;

  /**
   * Indentation of link
   */
  indentation: number;
}

/**
 * Literal string choice type (like an enum) used for the `kind`
 * property in things derived from MenuItems.
 */
type MenuItemKinds = "MenuAction" | "MenuLink" | "MenuRoute";

/**
 * User callback function
 */
export type UserCallback<T> = null | ((user?: User) => T);

/**
 * An item designed to be in a menu.
 * Do not use this directly, see the derived interfaces.
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
  /**
   * The order position of this link in comparison to others.
   */
  order?: Order;
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

/**
 * MenuRoute interface. Defines an internal page/route within this application.
 * Must be known to this angular app. e.g. /security/login
 * @extends MenuItem
 */
export interface MenuRoute extends MenuItem {
  kind: "MenuRoute";
  /**
   * The URL or fragment this link points to
   */
  route: InternalRoute;
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
 * Determines if a menu item is a link (MenuLink | MenuRoute)
 * @param menuItem Menu item
 */
export function isAnchor(
  menuItem: AnyMenuItem
): menuItem is MenuLink | MenuRoute {
  return menuItem.kind === "MenuLink" || menuItem.kind === "MenuRoute";
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
  fullscreen?: boolean;
}
