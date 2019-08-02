import { Data, Route } from "@angular/router";
import { List } from "immutable";
import { Type, Component } from "@angular/core";
import { PageInfo } from "./PageInfo";

/**
 * Part of an internal angular route
 */
export type RouteFragment = string;

/**
 * External URL
 */
export type Href = string;

export type Location = Route | Href;

/**
 * Fontawesome icon. Eg. ['fas', 'home']. All icons used must be imported in app.module.ts.
 */
export type Icon = readonly [string, string];

/**
 * The user's name
 */
export type User = string;

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

/**
 * An item designed to be in a menu.
 * @extends LabelAndIcon
 */
export interface MenuItem extends LabelAndIcon {
  /**
   * The tooltip that will be shown when context for this link is required.
   */
  tooltip: (user?: User) => string;
  /**
   * Whether or not to show this link.
   */
  predicate?: (user?: User) => boolean;
}

/**
 * MenuLink interface. Defines all the requirements of a link.
 * @extends MenuItem
 */
export interface MenuLink extends MenuItem {
  /**
   * The URL or fragment this link points to
   */
  uri: Location;
}

/**
 * Action Link interface. Defines all the requirements of a link.
 * @extends LabelAndIcon
 */
export interface MenuAction extends MenuItem {
  action: () => {};
}

export type ActionItem = MenuAction | MenuLink;

/**
 * MenusInfo interface. This stores information required to generate the
 * various menus attached to a component.
 * @param actions List of actions
 * @param links List of secondary links
 */
export interface Menus {
  actions: List<ActionItem>;
  links: List<MenuLink>;
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
