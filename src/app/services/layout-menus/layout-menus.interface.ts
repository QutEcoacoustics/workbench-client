/**
 * Menu interface. Defines what secondary and action menu's should look like.
 * @param secondary Secondary menu
 * @param action Action menu
 */
export interface LayoutMenusInterface {
  secondary?: SecondaryMenuInterface;
  action?: ActionMenuInterface;
}

/**
 * Secondary menu interface. Defines a list of secondary menu links.
 */
export interface SecondaryMenuInterface {
  links: SecondaryLinkInterface[];
}

/**
 * Action menu interface. Defines an action menu title and links.
 * @param title Action title
 * @param links Action links
 */
export interface ActionMenuInterface {
  list_title?: ActionListTitleInterface;
  links: SecondaryLinkInterface[];
}

/**
 * Action title interface. Defines an action menus icon and label.
 * @param icon Action icon eg. ['fas', 'home']
 * @param label Action label
 */
export interface ActionListTitleInterface {
  icon: [string, string];
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
export interface SecondaryLinkInterface {
  uri: Route | Href;
  icon: [string, string];
  label: string;
  tooltip: string;
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
export interface ActionLinkInterface {
  uri: Route | Href;
  icon: [string, string];
  label: string;
  tooltip: string;
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
 * Determine if an element is a Route class.
 * @param uri URI to evaluate
 */
export function isRoute(uri: Route | Href): uri is Route {
  return uri.type === 'Route';
}

/**
 * Determine if component extends SecondaryItem interface
 * @param component Component to evaluate
 */
export function isSecondaryItem(component: any): component is SecondaryLink {
  return (component as SecondaryLink).getSecondaryItem() !== null;
}

/**
 * Determine if component extends SecondaryMenu interface
 * @param component Component to evaluate
 */
export function isSecondaryMenu(component: any): component is LayoutMenus {
  return (component as LayoutMenus).getMenus() !== null;
}

/**
 * Determine if component extends ActionListTitle interface
 * @param component Component to evaluate
 */
export function isActionListTitle(
  component: any
): component is ActionListTitle {
  return (component as ActionListTitle).getActionListTitle() !== null;
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
  getSecondaryItem(): Readonly<SecondaryLinkInterface>;
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
  getActionListTitle(): Readonly<ActionListTitleInterface>;
}
