import { Data } from '@angular/router';

/**
 * Menu interface. Defines what secondary and action menu's should look like.
 * @param links Secondary menu
 * @param action Action menu
 */
export interface LayoutMenusInterface {
  links?: LinkInterface[];
  action?: ActionMenuInterface;
}

/**
 * Action menu interface. Defines an action menu title and links.
 * @param list_title Action title
 * @param links Action links
 */
export interface ActionMenuInterface {
  list_title?: NameAndIcon;
  links: ActionInterface[];
}

/**
 * Component Name and Icon
 * @param icon Component icon eg. ['fas', 'home']
 * @param label Component label
 */
export interface NameAndIcon {
  icon: Icon;
  label: string;
}

/**
 * Link interface. Defines all the requirements of a link.
 * @param uri: Internal angular route or external url
 * @param tooltip Link tooltip to show on hover
 * @param predicate Function to determine if link should be shown. Input is whether user is logged in
 */
export interface LinkInterface extends NameAndIcon {
  uri: InternalRoute | Href;
  tooltip: (user?: User | null) => string;
  predicate?: (loggedin: boolean) => boolean;
}

/**
 * Action Link interface. Defines all the requirements of a link.
 * @param action Function to run on click event
 * @param tooltip Link tooltip to show on hover
 * @param predicate Function to determine if link should be shown. Input is whether user is logged in
 * @extends NameAndIcon
 */
export interface ActionInterface extends NameAndIcon {
  action: Function;
  tooltip: (user?: User | null) => string;
  predicate?: (loggedin: boolean) => boolean;
}

/**
 * Internal angular route
 */
export type InternalRoute = string;

/**
 * External URL
 */
export type Href = string;

/**
 * Fontawesome icon. Eg. ['fas', 'home']. All icons used must be imported in app.module.ts.
 */
export type Icon = readonly [string, string];

/**
 * User data
 * @param loggedin Whether user is logged in
 * @param user_name Username of user
 */
export interface User {
  loggedIn?: boolean;
  user_name?: string;
}

/**
 * Page info class. This stores information required to generate the various menus of the page.
 * @param icon Page icon eg. ['fas', 'home']
 * @param label Page label
 * @param category Page category
 * @param uri Page route
 * @param tooltip Link tooltip
 * @param actions List of actions
 * @param links List of secondary menu links
 */
export class PageInfo implements Data, LinkInterface {
  icon: Icon;
  label: string;
  category: NameAndIcon;
  uri: InternalRoute;
  tooltip: (user?: User | null) => string;
  predicate?: (loggedin: boolean) => boolean;
  actions: ActionInterface[];
  links: LinkInterface[];
  constructor() {}
}
