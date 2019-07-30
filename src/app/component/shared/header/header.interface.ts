import {
  Route,
  Href
} from 'src/app/services/layout-menus/layout-menus.interface';
import { Icon } from '@fortawesome/fontawesome-svg-core';

/**
 * Action title interface. Defines an action menus icon and label.
 * @param icon Action icon eg. ['fas', 'home']
 * @param label Action label
 * @param predicate Function to determine if link should be shown. Input is whether user is logged in
 */
export interface HeaderItemInterface {
  icon: Icon;
  label: string;
  uri: Route | Href;
  predicate?: (loggedin: boolean) => boolean;
}

/**
 * Header Item interface.
 * This is designed for singular components which are a part of the header component.
 */
export declare interface HeaderItem {
  /**
   * Get header item details
   * @returns Header item
   */
  getHeaderItem(): Readonly<HeaderItemInterface>;
}
