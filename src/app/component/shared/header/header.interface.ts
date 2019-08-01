import {
  Href,
  Icon,
  MenuLink
} from "src/app/interfaces/layout-menus.interfaces";

/**
 * Header Item interface.
 * This is designed for singular components which are a part of the header component.
 */
export declare interface HeaderItem {
  /**
   * Get header item details
   * @returns Header item
   */
  getHeaderItem(): Readonly<MenuLink>;
}
