import { Data } from '@angular/router';

/**
 * Menu interface. Defines what secondary and action menu's should look like.
 * @param secondary Secondary menu
 * @param action Action menu
 */
export interface LayoutMenusInterface {
  links?: SecondaryMenuInterface;
  action?: ActionMenuInterface;
}

/**
 * Secondary menu interface. Defines a list of secondary menu links.
 */
export interface SecondaryMenuInterface {
  links: LinkInterface[];
}

/**
 * Action menu interface. Defines an action menu title and links.
 * @param title Action title
 * @param links Action links
 */
export interface ActionMenuInterface {
  list_title?: NameAndIcon;
  links: ActionInterface[];
}

// /**
//  * Action title interface. Defines an action menus icon and label.
//  * @param icon Action icon eg. ['fas', 'home']
//  * @param label Action label
//  */
// export interface ActionListTitleInterface {
//   icon: [string, string];
//   label: string;
// }
export interface NameAndIcon {
  icon: Icon;
  label: string;
}

/**
 * Secondary Link interface. Defines all the requirements of a link.
 * @param route Internal angular route
 * @param href External url route
 * @param icon Link icon eg. ['fas', 'home']
 * @param label Link label
 * @param tooltip Link tooltip to show on hover
 * @param predicate Function to determine if link should be shown. Input is whether user is logged in
 */
export interface LinkInterface extends NameAndIcon {
  uri: Route | Href;
  tooltip: (user?: User | null) => string;
  predicate?: (loggedin: boolean) => boolean;
}

/**
 * Action Link interface. Defines all the requirements of a link.
 * @param uri Internal angular route or external url
 * @param icon Link icon eg. ['fas', 'home']
 * @param label Link label
 * @param tooltip Link tooltip to show on hover
 * @param predicate Function to determine if link should be shown. Input is whether user is logged in
 */
export interface ActionInterface extends NameAndIcon {
  action: Function;
  tooltip: (user?: User | null) => string;
  predicate?: (loggedin: boolean) => boolean;
}

/**
 * Internal angular route
 */
export class Route {
  /**
   * Constructor
   * @param uri Internal route
   */
  constructor(public uri: string) {}

  /**
   * Returns the class type
   */
  get type() {
    return 'Route';
  }
}

/**
 * External URL
 */
export class Href {
  /**
   * Constructor
   * @param uri External URL route
   */
  constructor(public uri: string) {}

  /**
   * Returns the class type
   */
  get type() {
    return 'Href';
  }
}

/**
 * Secondary Item interface.
 * This is designed for components which may appear on the secondary menu
 */
export declare interface SecondaryLink {
  /**
   * Get secondary item details for component
   * @returns Secondary link item
   */
  getSecondaryItem(): Readonly<LinkInterface>;
}

/**
 * Secondary Menu interface.
 * This is designed for singular components which implement a seconday, page, action layout.
 */
export declare interface LayoutMenus {
  /**
   * List of secondary meny links to append to the default menu links.
   * Return undefined if defaults are fine.
   * @returns The menu links to append, undefined for defaults.
   */
  getMenus(): Readonly<LayoutMenusInterface> | undefined;
}

/**
 * Action List Title interface. This is designed for a group of SecondaryMenu components.
 * This defines how the action menu title will appear for the children components.
 */
export declare interface ActionListTitle {
  /**
   * Group title to be used by the action menu for all children components.
   * @returns The group title
   */
  getActionListTitle(): Readonly<NameAndIcon>;
}

type Icon = [string, string];
interface User {
  // todo
}

export class PageInfo implements Data, LinkInterface {
  icon: Icon;
  label: string;
  category: NameAndIcon;
  tooltip: (user?: User | null) => string;
  actions: ActionInterface[];
  links: LinkInterface[];
  uri: Route;
  // route: Route
  constructor() {}
  // constructor(icon: Icon, label:string, tooltip: (user?: User | null) => string) {}
}
